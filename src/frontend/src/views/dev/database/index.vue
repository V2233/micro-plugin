<template>
  <el-card>
    <el-divider> Redis </el-divider>
    <el-form>
      <el-form-item label="分隔符">
        <div style="display: flex; width: 100%">
          <el-input v-model="sep" size="small" style="width: 30px; margin-right: 5px"></el-input>
          <el-button icon="Refresh" size="small" @click="getAllRedisKeys"></el-button>
          <el-button size="small" @click="appendRootKey" style="margin-left: auto">添加</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span style="margin-left: auto; font-size: 12px; color: blue">
            <a @click="((dialogFormVisible = true), (curNode = node), $event.stopPropagation())"
              >添加</a
            >
            <a
              style="margin-left: 8px"
              @click="
                (delRedisKey(
                  node.data?.children.length > 0 ? node.data?.path + '*' : node.data?.path,
                  node.data?.children.length > 0 ? true : false
                ),
                $event.stopPropagation())
              "
              >删除</a
            >
          </span>
        </span>
      </template>
    </el-tree>
  </el-card>
  <CodeDialog ref="CodeDialogRef" />
  <el-dialog v-model="dialogFormVisible" title="添加键">
    <el-form>
      <el-form-item label="输入键名">
        <el-input v-model="inputValue" :input-style="{ width: '100%' }"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="appendKey"> 确认添加 </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import CodeDialog from '@/components/CodeDialog/index.vue';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  reqRedisKeys,
  reqGetRedisKey,
  reqSetRedisKey,
  reqDelRedisKey,
  reqDelRedisKeys,
} from '@/api/dev/database';

/** 对话框可见 */
const dialogFormVisible = ref(false);

/** 临时存储输入 */
const inputValue = ref('');

/** 临时存储节点 */
const curNode = ref();

/** key-tree */
const data = ref([]);

/** 约定分隔符 */
const sep = ref(':');

/** 当前键对应的值 */
const dbValue = ref('');

/** 代码框实例 */
const CodeDialogRef = ref();

interface Tree {
  name: string;
  path: string;
  children?: Tree[];
}

const defaultProps = {
  children: 'children',
  label: 'name',
};

/**
 * 获取所有键
 * @returns
 */
const getAllRedisKeys = async () => {
  let res = await reqRedisKeys(sep.value);
  if (res.code == 200) {
    data.value = res.data;
  }
};

/**
 * 获取单个
 * @params key
 * @returns
 */
const getRedisKey = async (key: string) => {
  let res = await reqGetRedisKey(key);
  if (res.code == 200) {
    dbValue.value = res.data;
  } else {
    dbValue.value = '[获取数据失败]:' + res.message;
  }
};

/**
 * 设置键
 * @params key
 * @params value
 * @returns
 */
const setRedisKey = async (key: string, value: any, dialog = true) => {
  let res = await reqSetRedisKey({ key, value });
  if (res.code == 200) {
    dbValue.value = res.data;
    if (dialog == true) {
      CodeDialogRef.value && CodeDialogRef.value.close();
    }
    ElMessage.success('保存成功！');
    getAllRedisKeys();
  } else {
    ElMessage.error('保存失败！');
  }
};

/**
 * 添加键
 * @returns
 */
const appendKey = async () => {
  console.log(curNode.value.data);

  if (inputValue.value == '') {
    ElMessage.error('键名不为空！');
    return;
  }
  const isExisted = curNode.value?.data?.children.some(
    (node: Tree) => node.name == inputValue.value
  );
  if (isExisted) {
    ElMessage.error('该键名已存在！');
    return;
  }
  await setRedisKey(
    `${curNode.value.data.path}${curNode.value.data.path == '' ? '' : ':'}${inputValue.value}`,
    '',
    false
  );
  dialogFormVisible.value = false;
  inputValue.value = '';
  getAllRedisKeys();
};

/**
 * 添加根节点的子节点
 * @returns
 */
const appendRootKey = () => {
  curNode.value = {
    data: {
      name: '',
      path: '',
      children: data.value,
    },
  };
  dialogFormVisible.value = true;
};

/**
 * 删除键
 * @params key
 * @returns
 */
const delRedisKey = async (key: string, multiple = false) => {
  let res = multiple ? await reqDelRedisKeys(key) : await reqDelRedisKey(key);
  if (res.code == 200) {
    ElMessage.success('删除成功！');
    getAllRedisKeys();
  }
};

/**
 * 处理子节点点击事件
 * @param data
 * @returns
 */
const handleNodeClick = async (data: Tree) => {
  // console.log(data)
  if (data.children?.length == 0) {
    await getRedisKey(data.path);
    CodeDialogRef.value.open({
      content: dbValue.value,
      confirm: (newValue: string) => {
        setRedisKey(data.path, newValue);
      },
    });
  }
};

onMounted(() => {
  getAllRedisKeys();
});
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  a:hover {
    color: rgba(0, 119, 255, 0.542);
  }
}
</style>
