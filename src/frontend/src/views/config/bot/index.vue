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

    <div v-if="cfgName.name != 'group'">
      <SingleForm v-model:cfg="cfgData" />
    </div>

    <div v-else>
      <div style="margin-bottom: 10px; display: flex">
        <el-input
          v-if="cfgName.name == 'group'"
          v-model="newGroupName"
          style="width: 100%; margin-left: 5px"
        ></el-input>
        <el-button
          v-if="cfgName.name == 'group'"
          @click="addTab"
          icon="Plus"
          style="margin-left: 5px"
        >
          <el-icon>
            <Avatar />
          </el-icon>
        </el-button>
      </div>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          :lazy="false"
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <SingleForm v-model:cfg="item.content" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reqBotConfig, reqSetBotConfig } from '@/api/config';
import SingleForm from './single.vue';

interface tabType {
  title: string;
  name: string;
  content: any;
}

const cfgOptions = ref([
  {
    title: 'Bot',
    name: 'bot',
  },
  {
    title: '群组',
    name: 'group',
  },
  {
    title: '通知',
    name: 'notice',
  },
  {
    title: '其它',
    name: 'other',
  },
  {
    title: '截图工具',
    name: 'puppeteer',
  },
  {
    title: 'QQ',
    name: 'qq',
  },
  {
    title: 'Redis',
    name: 'redis',
  },
  {
    title: '渲染器',
    name: 'renderer',
  },
]);

const cfgName = ref({
  title: 'Bot',
  name: 'bot',
});

const cfgData = ref();

const editableTabsValue = ref('default');

const newGroupName = ref('');

const editableTabs = ref<{ title: string; name: string; content: any }[]>([]);

let tabIndex = 1;

/**
 * 获取Bot配置
 * @param name 配置文件名称
 * @returns
 */
const getCfg = async (name: string) => {
  cfgName.value.name = name;
  let res: any = await reqBotConfig(name);
  if (res.code == 200) {
    if (name == 'group') {
      editableTabs.value = [];
      for (let key in res.data) {
        editableTabs.value.push({
          title: key,
          name: key,
          content: res.data[key],
        });
      }
    } else {
      cfgData.value = res.data;
    }
  }
};

/**
 * 添加群号
 * @returns
 */
const addTab = () => {
  if (!newGroupName.value) {
    ElMessage.error('请输入群号！');
    return;
  }

  if (editableTabs.value.find(item => item.name == newGroupName.value)) {
    ElMessage.error('该群已存在！');
    return;
  }
  const newTabName = `${++tabIndex}`;
  let defaultCfg = editableTabs.value.find(item => item.name == 'default');
  editableTabs.value.push({
    title: newGroupName.value,
    name: newGroupName.value,
    content: JSON.parse(JSON.stringify(defaultCfg?.content)),
  });

  editableTabsValue.value = newTabName;
};

const removeTab = (targetName: string) => {
  const tabs = editableTabs.value;
  if (targetName == 'default') {
    ElMessage.error('默认配置不能删除！');
    return;
  }
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter(tab => tab.name !== targetName);
};

const saveCfg = async () => {
  let preSentData: any;
  if (cfgName.value.name == 'group') {
    preSentData = editableTabs.value.reduce(
      (accumulator: { [key: string]: any }, currentValue: tabType) => {
        accumulator[currentValue.name] = currentValue.content;
        return accumulator;
      },
      {}
    );
  } else {
    preSentData = cfgData.value;
  }
  console.log(cfgName.value.name);
  // return
  let res: any = await reqSetBotConfig(cfgName.value.name, preSentData);
  if (res.code == 200) {
    ElMessage.success('保存成功！');
  }
};

onMounted(() => {
  getCfg('bot');
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
