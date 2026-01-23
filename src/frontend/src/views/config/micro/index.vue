<template>
  <el-card>
    <div style="width: 100%; display: flex; justify-content: space-between">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="注意只保存当前标签配置，切换标签会刷新配置"
        placement="bottom"
      >
        <el-button type="primary" @click="saveCfg">保存配置</el-button>
      </el-tooltip>
      <el-select v-model="cfgName.title" placeholder="Select" style="width: 100px" @change="getCfg">
        <el-option
          v-for="(item, index) in cfgOptions"
          :key="index"
          :label="item.title"
          :value="item.name"
        />
      </el-select>
    </div>

    <el-divider />

    <div>
      <SingleForm v-model:cfg="cfgData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reqPluginConfig, reqSetPluginConfig } from '@/api/config';
import SingleForm from './single.vue';

const cfgName = ref({
  title: 'Bot',
  name: 'bot',
});

const cfgData = ref();

const editableTabsValue = ref('default');

const newGroupName = ref('');

const editableTabs = ref<{ title: string; name: string; content: any }[]>([]);

let tabIndex = 1;

interface tabType {
  title: string;
  name: string;
  content: any;
}

const cfgOptions = ref([
  {
    title: '面板设置',
    name: 'server',
  },
]);

/**
 * 获取Bot配置
 * @param name 配置文件名称
 * @returns
 */
const getCfg = async (name: string) => {
  cfgName.value.name = name;
  let res: any = await reqPluginConfig('micro-plugin', name);
  if (res.code == 200) {
    cfgData.value = res.data;
  }
};

const saveCfg = async () => {
  let preSentData: any;
  // if (cfgName.value.name == 'group') {
  //     preSentData = editableTabs.value.reduce((accumulator: { [key: string]: any }, currentValue: tabType) => {
  //         accumulator[currentValue.name] = currentValue.content
  //         return accumulator;
  //     }, {});
  // } else {
  //     preSentData = cfgData.value
  // }
  preSentData = cfgData.value;
  // console.log(cfgName.value.name)
  let res: any = await reqSetPluginConfig('micro-plugin', cfgName.value.name, preSentData);
  if (res.code == 200) {
    ElMessage.success('保存成功！');
  }
};

onMounted(() => {
  getCfg('server');
});
</script>

<style lang="scss" scoped>
.sub-title {
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  align-items: center;
  margin-bottom: 5px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
