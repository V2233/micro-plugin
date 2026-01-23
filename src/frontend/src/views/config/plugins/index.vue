<template>
  <el-card style="margin: 10px 0">
    <!-- 选择栏 -->
    <div class="top-bar">
      <el-button v-if="scene == 1" class="button" icon="Back" @click="scene = 0"></el-button>
      <el-button
        v-if="scene == 1"
        class="button"
        type="primary"
        @click="setPluginConfig(curPluginName, 'guoba')"
        style="margin-left: auto"
        >保存</el-button
      >
      <el-select
        v-if="scene == 0"
        v-model="curSource"
        placeholder="配置来源"
        style="width: 150px; margin-left: auto"
      >
        <el-option
          v-for="(item, index) in sourceSelect"
          :key="index"
          :label="item.lable"
          :value="item.value"
        />
      </el-select>
    </div>

    <!-- 锅巴配置 -->
    <div class="guoba" v-if="curSource == 'guoba'">
      <!-- 插件信息列表 -->
      <div class="plugins-info" v-show="scene == 0">
        <el-card class="info-card" shadow="hover" v-for="(p, index) in pluginsInfo" :key="index">
          <div class="card-header">
            <div class="sub-title">{{ p.title ?? p.name }}</div>
            <el-button
              class="button"
              size="small"
              type="primary"
              @click="getPluginConfig(p.pluginName, 'guoba')"
              >配置</el-button
            >
          </div>
          <el-divider></el-divider>
          <div class="content">
            <div class="description">
              <span class="lable">描述：</span>
              <span class="text">{{ p.description }}</span>
            </div>
            <div class="author">
              <span class="lable">作者：</span>
              <a :href="p.authorLink" target="_blank">{{ p.author }}</a>
            </div>
            <div class="link">
              <span class="lable">仓库：</span>
              <a :href="p.link">{{ p.link }}</a>
            </div>
            <div class="version" style="width: 100%; display: flex">
              <span class="lable">版本：</span>
              <el-tag size="small" v-if="p.isV2">v2</el-tag>
              <el-tag size="small" v-if="p.isV3">v3</el-tag>
              <el-tag size="small" v-if="p.isV4">v4</el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 配置页 -->
      <div class="plugin-config" v-show="scene == 1">
        <el-form>
          <el-form-item v-for="(cfg, index) in pluginCfg" :key="index">
            <div style="display: block; width: 100%">
              <el-divider v-if="cfg.component == 'Divider'">{{ cfg.label }}</el-divider>
              <div class="config-title" v-if="cfg.component !== 'Divider'">
                {{ cfg.label }}<span class="required" v-if="cfg.required">*</span>
              </div>
              <!-- 表单组件 -->
              <div class="config-com" v-if="'value' in cfg">
                <el-select v-model="cfg.value" v-if="cfg.component == 'Select'" style="width: 100%">
                  <el-option
                    v-for="(option, id) in cfg.componentProps.options"
                    :key="id"
                    :label="option.lable"
                    :value="option.value"
                  />
                </el-select>
                <el-input
                  v-if="cfg.component == 'Input'"
                  v-model="cfg.value"
                  :place-holder="cfg.componentProps?.placeholder ?? ''"
                />
                <el-input
                  v-if="cfg.component == 'InputTextArea'"
                  v-model="cfg.value"
                  :place-holder="cfg.componentProps?.placeholder ?? ''"
                  type="textarea"
                />
                <el-input
                  v-if="cfg.component == 'InputPassword'"
                  v-model="cfg.value"
                  :place-holder="cfg.componentProps?.placeholder ?? ''"
                  type="password"
                />
                <el-input-number
                  v-if="cfg.component == 'InputNumber'"
                  v-model="cfg.value"
                  :min="cfg.componentProps?.min ?? -2147483648"
                  :max="cfg.componentProps?.max ?? 2147483647"
                  :place-holder="cfg.componentProps?.placeholder ?? ''"
                  size="small"
                />
                <el-switch v-if="cfg.component == 'Switch'" v-model="cfg.value" />
              </div>
              <div class="bottom-desc" v-if="cfg.bottomHelpMessage">
                {{ cfg.bottomHelpMessage }}
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 自动匹配模式 -->
    <div class="auto-search" v-if="curSource == 'auto'">
      <el-form>
        <el-form-item>实验性，请跳过该模块...</el-form-item>
      </el-form>
      <el-input v-model="extendedName" />
      <el-button @click="getSearchPath" style="margin-top: 10px">
        点击筛选包含特定关键词的文件分支
      </el-button>
      <Editor v-if="treeCode" :code="treeCode" ext="json" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Editor from '../../dev/fs/codeEditor.vue';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { reqFilterDirTree } from '@/api/dev/fs/index';
import { reqPluginInfo, reqPluginConfig, reqSetPluginConfig } from '@/api/config/index';

import { reqBotWorkURI } from '@/api/dev/plugin';
import type { botURIResponseType } from '@/api/dev/plugin/type';
import type {
  guobaPluginsConfigResponseType,
  guobaPluginsInfoResponseType,
  guobaPluginInfoType,
  schemaType,
} from '@/api/config/type';

// 插件信息列表
const pluginsInfo = ref<guobaPluginInfoType[]>([]);
// 配置表单
const pluginCfg = ref<schemaType[]>([]);
// 当前正在配置的对象
const curPluginName = ref('');

// 配置来源
const curSource = ref('guoba');
const sourceSelect = ref([
  {
    lable: 'guobaSupport',
    value: 'guoba',
  },
  {
    lable: '自动匹配',
    value: 'auto',
  },
]);

// 插件卡片展示宽度
const cardWidth = ref('33%');
// 插件配置
const scene = ref(0);

/**
 * 获取插件信息列表
 * @param source
 */
const getPluginsInfo = async (source = 'guoba') => {
  const res: guobaPluginsInfoResponseType = await reqPluginInfo(source);
  console.log(res);
  if (res.code == 200) {
    pluginsInfo.value = res.data;
  }
};

/**
 * 获取插件配置
 * @param pluginName
 * @param source
 */
const getPluginConfig = async (pluginName: string, source = 'guoba') => {
  curPluginName.value = pluginName;
  const res: guobaPluginsConfigResponseType = await reqPluginConfig(pluginName, source);
  console.log(res);
  if (res.code == 200) {
    pluginCfg.value = res.data;
  }
  scene.value = 1;
};

const setPluginConfig = async (pluginName: string, source = 'guoba') => {
  const res = await reqSetPluginConfig(pluginName, source, pluginCfg.value);
  if (res.code == 200) {
    ElMessage.success(res.message);
  }
};

/** --------------自动匹配逻辑（todo）------------------- */

const extendedName = ref('');

const treeCode = ref('');

const searchPath = ref('');

const getFilteredTree = async () => {
  console.log(extendedName.value);

  if (extendedName.value == '') {
    ElMessage.error('筛选条件为空！');
    return;
  }

  let res = await reqFilterDirTree(searchPath.value + '/plugins', extendedName.value);
  if (res.code == 200) {
    console.log(res.data);
    treeCode.value = res.data;
  }
};

const getSearchPath = async () => {
  let res: botURIResponseType = await reqBotWorkURI();
  if (res.code == 200) {
    treeCode.value = res.data.replace(/^file:\/\//, '');
  }
};

// window.onresize = () => {
//   if (window.innerWidth > window.innerHeight) {
//     cardWidth.value = '33%'
//   } else {
//     cardWidth.value = '100%'
//   }
// }

onMounted(() => {
  // getSearchPath()
  getPluginsInfo();
});
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 12px 0;
}

.sub-title {
  position: relative;
  height: 24px;
  width: calc(100% - 60px);
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  align-items: center;
  margin-bottom: 15px;
}

.config-title {
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  align-items: center;
  margin-bottom: 5px;
}

.top-bar {
  display: flex;
  width: 100%;
  height: 40px;
}

.plugins-info {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  .info-card {
    position: relative;
    width: 100%;
    margin: 5px 0;
    .card-header {
      display: flex;
      justify-content: space-between;
      height: 24px;
    }
    .content {
      font-size: 14px;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
      a {
        color: rgb(64, 158, 255);
        font-weight: 560;
        text-decoration: none;
      }
      .lable {
        font-weight: 700;
      }
      .description {
        margin-bottom: 6px;
        font-weight: 560;
        .text {
          font-size: 12px;
          color: #929292;
        }
      }
      .version {
        position: relative;
        margin-bottom: 6px;
        .el-tag {
          position: relative;
          top: -5px;
        }
      }
      .author {
        margin-bottom: 6px;
      }
      .link {
        margin-bottom: 6px;
      }
    }
  }
}

@media (orientation: landscape) {
  .plugins-info {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    .info-card {
      width: calc((100% - 30px) / 3);
      margin: 5px 5px;
    }
  }
}

.plugin-config {
  .bottom-desc {
    font-size: 12px;
    color: #929292;
    line-height: 18px;
  }
  .required {
    color: red;
  }
}
</style>
