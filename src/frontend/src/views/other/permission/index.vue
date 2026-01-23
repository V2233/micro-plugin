<template>
  <el-card>
    <div class="top_bar">
      <div class="sub-title">用户权限</div>
      <div>
        <el-button type="primary" icon="Plus" @click="addAdmin"> 添加 </el-button>
      </div>
    </div>

    <el-table :data="adminList">
      <el-table-column type="index" label="#"></el-table-column>

      <el-table-column label="账号">
        <template #="{ row, $index }">
          {{ row.username.value }}
        </template>
      </el-table-column>

      <el-table-column label="描述">
        <template #="{ row, $index }">
          <span style="font-size: 12px">{{ row.desc.value }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="120px">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editAdmin(row, $index)"
          ></el-button>
          <el-popconfirm title="删除后不可恢复，您确定吗？" @confirm="deleteAdmin($index)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="curAdmin.desc ? curAdmin.desc.value : '新增管理员'">
    <!-- <SingleForm v-model:cfg="curAdmin" /> -->
    <el-button type="primary" @click="saveAdminConfig"> 保存 </el-button>
    <el-form-item v-for="(item, key, index) in curAdmin" :key="key" :lable="item.desc">
      <div class="sub-title">{{ item.desc }}</div>
      <el-input v-if="item.type == 'string'" v-model="item.value"></el-input>
      <el-input-number v-if="item.type == 'number'" v-model="item.value" />
      <el-switch
        v-if="item.type == 'boolean'"
        v-model="item.value"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66"
        active-text="Y"
        inactive-text="N"
      />
      <div v-if="item.type == 'array'">
        <el-checkbox-group v-model="item.value">
          <el-checkbox v-for="r in routeMap" :key="r.route" :value="r.route">{{
            r.title
          }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { reqUserConfig, reqSetUserConfig } from '@/api/config/index';
import type { userConfigType, userConfigResponseType } from '@/api/config/type';
import { ElMessage } from 'element-plus';

const routeMap = ref([
  {
    route: 'Status',
    title: '状态',
  },
  {
    route: 'Logs',
    title: '日志',
  },
  {
    route: 'Fs',
    title: '文件',
  },
  {
    route: 'Plugin',
    title: '开发',
  },
  {
    route: 'Bot',
    title: 'Bot配置',
  },
  {
    route: 'Protocol',
    title: '协议配置',
  },
  {
    route: 'Plugins',
    title: '其它配置',
  },
  {
    route: 'Permission',
    title: '权限管理',
  },
  {
    route: 'About',
    title: '关于',
  },
]);

//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);

const adminList = ref<userConfigType[]>([]);

const curAdminIndex = ref(0);

const mode = ref('add');

const curAdmin = ref<userConfigType>({} as userConfigType);

const getAdminList = async () => {
  let res: userConfigResponseType = await reqUserConfig();
  // console.log(res)
  if (res.code == 200) {
    adminList.value = res.data;
  }
};

const addAdmin = () => {
  mode.value = 'add';
  const adminObj = JSON.parse(JSON.stringify(adminList.value[0]));
  adminObj.username.value = '';
  adminObj.password.value = '';
  adminObj.avatar.value = '';
  adminObj.expires.value = '86400s';
  curAdmin.value = adminObj;
  // curAdminIndex.value = adminList.value.length
  dialogVisible.value = true;
  // adminList.value.push(adminObj)
};

const editAdmin = (row: any, index: number) => {
  mode.value = 'update';
  curAdmin.value = row;
  curAdminIndex.value = index;
  dialogVisible.value = true;
};

/**
 * 去重
 * @param arr
 * @param propertyName
 */
const hasDuplicate = (arr: any, propertyName: string) => {
  const valueSet = new Set();

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i][propertyName].value;
    if (valueSet.has(value)) {
      return true; // 发现重复值
    }
    valueSet.add(value);
  }

  return false; // 没有发现重复值
};

const saveAdminConfigList = async () => {
  let res: any = await reqSetUserConfig(adminList.value);
  console.log(res);
  if (res.code == 200) {
    ElMessage.success('保存成功！');
    getAdminList();
    dialogVisible.value = false;
  }
};

const deleteAdmin = (index: number) => {
  if (adminList.value.length <= 1) {
    ElMessage.error('不可清空！');
    return;
  }

  adminList.value.splice(index, 1);
  console.log(adminList.value);

  saveAdminConfigList();
};

const saveAdminConfig = () => {
  if (mode.value == 'add') {
    if (!curAdmin.value.password.value) {
      ElMessage.error('密码不能为空！');
      return;
    }

    if (curAdmin.value.password.value.length < 5 || curAdmin.value.password.value.length > 20) {
      ElMessage.error('密码长度5-20位！');
      return;
    }

    if (curAdmin.value.username.value.length < 2 || curAdmin.value.username.value.length > 20) {
      ElMessage.error('账号长度2-20位！');
      return;
    }

    adminList.value.push(curAdmin.value);
    if (hasDuplicate(adminList.value, 'username')) {
      ElMessage.error('已存在相同账号！');
      getAdminList();
      return;
    }
  } else {
    adminList.value[curAdminIndex.value] = curAdmin.value;
  }

  dialogVisible.value = false;
  saveAdminConfigList();
};

// const checkRoute = (e) => {
//   console.log(e)
//   console.log(curAdmin.value)
// }

onMounted(() => {
  getAdminList();
});
</script>

<style scoped lang="scss">
.top_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sub-title {
    position: relative;
    height: 24px;
    width: 100px;
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    align-items: center;
    margin-bottom: 15px;
  }
}
</style>
