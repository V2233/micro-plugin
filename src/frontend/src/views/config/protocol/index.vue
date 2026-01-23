<template>
  <el-card>
    <div style="width: 100%; display: flex">
      <el-button type="primary" style="margin-left: auto" @click="saveCfg">保存配置</el-button>
    </div>

    <el-divider>Stdin</el-divider>

    <div v-if="cfgData.stdin">
      <SingleForm v-model:cfg="cfgData.stdin" />
    </div>

    <el-divider>onebotv11</el-divider>

    <div v-if="cfgData.onebotv11">
      <SingleForm v-model:cfg="cfgData.onebotv11" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reqProtocolConfig, reqSetProtocolConfig } from '@/api/config';
import SingleForm from '../bot/single.vue';

const cfgData = ref<any>({});

/**
 * 获取适配器配置
 * @param name 配置文件名称
 * @returns
 */
const getCfg = async () => {
  let res: any = await reqProtocolConfig();
  if (res.code == 200) {
    cfgData.value = res.data;
  }
};

const saveCfg = async () => {
  let res: any = await reqSetProtocolConfig(cfgData.value);
  if (res.code == 200) {
    ElMessage.success('保存成功！');
  }
};

onMounted(() => {
  getCfg();
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
</style>
