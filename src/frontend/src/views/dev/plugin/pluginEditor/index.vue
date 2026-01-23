<template>
  <div class="root_box">
    <div class="plugin_box" v-show="devStore.scene == 1">
      <el-card>
        <el-button @click="goBack">返回</el-button>
        <el-button @click="savePlugin">保存</el-button>
      </el-card>
      <!-- 触发规则 -->
      <el-card style="margin: 10px 0">
        <div class="sub-title">触发规则</div>
        <el-form label-width="84px">
          <el-form-item label="事件类型">
            <el-input
              v-model="pluginData.event"
              placeholder="目前暂支持message"
              disabled
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="定时任务">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="必须关闭全局触发，会将消息推送到白名单群或用户，且消息段无法使用e变量，填了需重启机器人生效"
              placement="bottom-start"
            >
              <el-input
                v-model="pluginData.cron"
                placeholder="cron表达式，如：0 0 0 * * ?"
                :disabled="pluginData.isGlobal == true"
                style="width: 100%"
              ></el-input>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="正则表达式">
            <el-input v-model="pluginData.reg" placeholder="^hello" style="width: auto"></el-input>
            <el-select
              v-model="pluginData.flag"
              placeholder="默认Flags"
              style="width: 200px; margin: 0 5px"
            >
              <el-option
                v-for="(item, index) in flagsList"
                :key="index"
                :label="item.desc"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="延迟">
            <el-input
              v-model="pluginData.delayTime"
              placeholder="如果设置了多个相同指令插件，那么将会按照该时间顺序延迟执行（单位：毫秒）"
              style="width: 100%"
            ></el-input>
          </el-form-item>

          <el-form-item label="@回复">
            <el-switch
              v-model="pluginData.isAt"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66"
              active-text="Y"
              inactive-text="N"
            />
          </el-form-item>

          <el-form-item label="引用回复">
            <el-switch
              v-model="pluginData.isQuote"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66"
              active-text="Y"
              inactive-text="N"
            />
          </el-form-item>

          <el-form-item label="全局触发">
            <el-switch
              v-model="pluginData.isGlobal"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66"
              active-text="Y"
              inactive-text="N"
            />
          </el-form-item>

          <el-form-item :label="pluginData.isGlobal ? '黑名单群' : '白名单群'">
            <el-input v-model="curGroup" placeholder="群号" style="width: 100px"></el-input>
            <el-button icon="Plus" @click="addGroups" style="margin-left: 10px"></el-button>
            <el-dropdown
              max-height="200px"
              v-if="pluginData.groups.length > 0"
              style="margin-left: 10px"
            >
              <el-button>
                <el-icon><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(groupId, index) in pluginData.groups" :key="index">
                    {{ groupId }}
                    <el-icon class="el-icon--right" @click="deleteGroupId(index)">
                      <CircleCloseFilled />
                    </el-icon>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>

          <el-form-item :label="pluginData.isGlobal ? '黑名单用户' : '白名单用户'">
            <el-input v-model="curFriend" placeholder="好友" style="width: 100px"></el-input>
            <el-button icon="Plus" @click="addFriend" style="margin-left: 10px"></el-button>
            <el-dropdown
              max-height="200px"
              v-if="pluginData.friends.length > 0"
              style="margin-left: 10px"
            >
              <el-button>
                <el-icon><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(fiendId, index) in pluginData.friends" :key="index">
                    {{ fiendId }}
                    <el-icon class="el-icon--right" @click="deleteFriendId(index)">
                      <CircleCloseFilled />
                    </el-icon>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 消息段 -->
      <el-card style="margin: 10px 0">
        <div class="title_bar">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="注意：该卡片内的所有消息均为同一条消息，这意味这你可以同时添加文字和多张图片，但是受平台限制音视频需要单独发送！"
            placement="top-start"
          >
            <div class="sub-title">消息段</div>
          </el-tooltip>
          <el-select
            @change="addMsgSegment"
            placeholder="添加消息"
            style="width: 150px; margin: 0 5px"
          >
            <el-option
              v-for="(item, index) in messageSeg"
              :key="index"
              :label="item.type"
              :value="item.default"
            />
          </el-select>
        </div>

        <!-- 对消息段种类的处理 -->
        <el-form style="margin-bottom: 100px">
          <div v-for="(seg, index) in messageData" :key="index">
            <el-form-item v-if="seg.type == 'text'" label="文本">
              <div class="input_box">
                <!-- <CusInput width="100%" :ref="(vc:any) => {msgRefs[seg.refKey as string] = vc}"/> -->
                <CusInput
                  width="100%"
                  :cusInputValue="cusInputText['index' + index]"
                  @inner-text="setTextData($event, index)"
                />
                <el-button
                  style="margin-left: 10px"
                  @click="deleteMsgSeg(index)"
                  icon="CloseBold"
                ></el-button>
              </div>
            </el-form-item>

            <!-- 图片 -->
            <el-form-item v-if="seg.type == 'image'" label="图片">
              <div class="input_box">
                <el-autocomplete
                  v-model="seg.url"
                  :fetch-suggestions="querySearchTip"
                  clearable
                  :disabled="seg.hash != ''"
                  placeholder="http://或https://或file://"
                />

                <el-button
                  style="margin-left: 10px"
                  @click="uploadFile(index, seg.type)"
                  :disabled="seg.url != '' || seg.hash != ''"
                >
                  上传图片
                </el-button>
                <el-button
                  style="margin-left: 10px"
                  @click="goPicEditor(index, seg)"
                  :disabled="seg.url != ''"
                >
                  <el-icon v-if="seg.hash">
                    <CircleCheck color="rgb(103,158,255)" />
                  </el-icon>
                  <span v-else>在线制作</span>
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 音频 -->
            <el-form-item v-if="seg.type == 'record'" label="音频">
              <div class="input_box">
                <el-autocomplete
                  v-model="seg.url"
                  :fetch-suggestions="querySearchTip"
                  clearable
                  placeholder="http://或https://或file://"
                />

                <el-button
                  style="margin-left: 10px"
                  @click="uploadFile(index, seg.type)"
                  :disabled="seg.url != ''"
                >
                  上传音频
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 视频 -->
            <el-form-item v-if="seg?.type == 'video'" label="视频">
              <div class="input_box">
                <el-autocomplete
                  v-model="seg.url"
                  :fetch-suggestions="querySearchTip"
                  clearable
                  placeholder="http://或https://或file://"
                />

                <el-button
                  style="margin-left: 10px"
                  @click="uploadFile(index, seg.type)"
                  :disabled="seg.url != ''"
                >
                  上传视频
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 表情 -->
            <el-form-item v-if="seg?.type == 'face'" label="表情">
              <div class="input_box">
                <el-popover placement="top-start" title="QQFaces" :width="300" trigger="hover">
                  <div class="face-box">
                    <el-image
                      class="face-image"
                      v-for="face in faceData"
                      :key="face.QSid"
                      :src="`/qfaces/s${face.QSid}.gif`"
                      @click="
                        ((seg.data = Number(face.QSid)),
                        (messageData[index]!.path = `/qfaces/s${face.QSid}.gif`))
                      "
                    />
                  </div>

                  <template #reference>
                    <el-input-number v-model="seg.data"></el-input-number>
                  </template>
                </el-popover>

                <el-button v-if="messageData[index]?.path">
                  <el-image
                    class="face-image"
                    :key="index"
                    :src="messageData[index]?.path"
                    style="width: 30px; height: 30px"
                  />
                </el-button>

                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 戳一戳 -->
            <el-form-item v-if="seg?.type == 'poke'" label="戳一戳">
              <div class="input_box">
                <el-popover placement="top-start" title="戳一戳类型" :width="220" trigger="hover">
                  <div class="face-box" style="height: 120px">
                    <el-image
                      class="face-image"
                      v-for="(pokeId, id) in 6"
                      :key="id"
                      :src="`/qpoke/${pokeId}.gif`"
                      style="width: 50px; height: 50px"
                      @click="
                        ((seg.data = Number(pokeId)),
                        (messageData[index]!.path = `/qpoke/${pokeId}.gif`))
                      "
                    />
                  </div>

                  <template #reference>
                    <el-input-number v-model="seg.data" :min="0" :max="6"></el-input-number>
                  </template>
                </el-popover>
                <el-button v-if="messageData[index]?.path">
                  <el-image
                    class="face-image"
                    :key="index"
                    :src="messageData[index]?.path"
                    style="width: 30px; height: 30px"
                  />
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 骰子 -->
            <el-form-item v-if="seg?.type == 'dice'" label="骰子">
              <div class="input_box">
                <el-popover
                  placement="top-start"
                  title="骰子(协议端不一定可用)"
                  :width="220"
                  trigger="hover"
                >
                  <div class="face-box" style="height: 120px">
                    <el-image
                      class="face-image"
                      v-for="(diceId, id) in 6"
                      :key="id"
                      :src="`/dice/${diceId}.png`"
                      style="width: 50px; height: 50px"
                      @click="
                        ((seg.data = Number(diceId)),
                        (messageData[index]!.path = `/dice/${diceId}.png`))
                      "
                    />
                  </div>

                  <template #reference>
                    <el-input-number v-model="seg.data" :min="0" :max="6"></el-input-number>
                  </template>
                </el-popover>
                <el-button v-if="messageData[index]?.path">
                  <el-image
                    class="face-image"
                    :key="index"
                    :src="messageData[index]?.path"
                    style="width: 30px; height: 30px"
                  />
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- 猜拳 -->
            <el-form-item v-if="seg?.type == 'rps'" label="猜拳">
              <div class="input_box">
                <el-popover
                  placement="top-start"
                  title="猜拳(协议端不一定可用)"
                  :width="220"
                  trigger="hover"
                >
                  <div class="face-box" style="height: 60px">
                    <el-image
                      class="face-image"
                      v-for="(rpsId, id) in 3"
                      :key="id"
                      :src="`/rps/${rpsId}.png`"
                      style="width: 50px; height: 50px"
                      @click="
                        ((seg.data = Number(rpsId)),
                        (messageData[index]!.path = `/rps/${rpsId}.png`))
                      "
                    />
                  </div>

                  <template #reference>
                    <el-input-number v-model="seg.data" :min="0" :max="6"></el-input-number>
                  </template>
                </el-popover>
                <el-button v-if="messageData[index]?.path">
                  <el-image
                    class="face-image"
                    :key="index"
                    :src="messageData[index]?.path"
                    style="width: 30px; height: 30px"
                  />
                </el-button>
                <el-button style="margin-left: 10px" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
            </el-form-item>

            <!-- markdown -->
            <el-form-item v-if="seg?.type == 'markdown'">
              <div class="type-title" style="font-weight: 500; margin-bottom: 10px">
                Markdown
                <el-button style="margin-left: 10px" size="small" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
              <div class="seg_card_box">
                <!-- content -->
                <MarkdownCom :md-content="seg.content" />
              </div>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item v-if="seg?.type == 'button'">
              <div class="type-title" style="font-weight: 500; margin-bottom: 10px">
                按钮(icqq)
                <el-button style="margin-left: 10px" size="small" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
              <div class="seg_card_box">
                <!-- appid 和 rows -->
                <BtnCom v-model:btn-content="seg.content" />
              </div>
            </el-form-item>

            <!-- 代码段 -->
            <el-form-item v-if="seg?.type == 'code'">
              <div class="type-title" style="font-weight: 500; margin-bottom: 10px">
                自定义代码
                <el-button style="margin-left: 10px" size="small" @click="deleteMsgSeg(index)">
                  <el-icon>
                    <CloseBold />
                  </el-icon>
                </el-button>
              </div>
              <Editor :code="seg.data as string" ext="js" @getCode="saveCodeSeg($event, seg)" />
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 文件上传统一对话框 -->
    <el-dialog v-model="dialogFormVisible" title="请上传文件！">
      <el-upload
        class="file_uploader"
        action="/api/fs/upload"
        multiple
        ref="uploadRef"
        v-model:file-list="fileList"
        :data="extraUploadData"
        :show-file-list="true"
        :on-preview="handleFilePreview"
        :on-success="handleUploadSuccess"
        :before-upload="handleUpload"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
      </el-upload>
      <template #footer>
        <el-button type="primary" size="default" @click="confirmUpload"> 确认提交 </el-button>
      </template>
    </el-dialog>

    <!-- 图片编辑器 -->
    <div class="pic_editor" v-if="devStore.scene == 2">
      <ImageEditor @outerHTML="setImageData" @mounted="onUpdateImageJson" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reqAddPlugin,
  reqBotWorkURI,
  reqBtnJson,
  reqEditorPlugin,
  reqImageJson,
} from '@/api/dev/plugin';
import type {
  botURIResponseType,
  messageType,
  pluginElResponseType,
  pluginResponseType,
  pluginType,
} from '@/api/dev/plugin/type';
import faceData from '@/assets/qfaces/data.json';
import CusInput from '@/components/CusInput/index.vue';
import useDevStore from '@/store/modules/dev';
import { getMD5Hash } from '@/utils/hash';
import type { UploadInstance, UploadProps } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';
import Editor from '../../fs/codeEditor.vue';
import ImageEditor from './imageEditor/index.vue';
import BtnCom from './segment/button.vue';
import { buttonEl, markdownEl } from './segment/default';
import MarkdownCom from './segment/markdown.vue';
import { codeTip } from './utils/codeTip';

// 为图片编辑器传数据
import { useCommand } from '@/plugins/editor/src/hooks/useCommand';
// import { $upload } from '@/plugins/editor/src/components/common'
import { useEditorStore } from '@/plugins/editor/src/store';

const esEditorStore = useEditorStore();
const { commands } = useCommand(esEditorStore);

// 上传对话框开关
const dialogFormVisible = ref<boolean>(false);

// 文件上传路径
const extraUploadData = reactive({
  path: '',
  curType: '',
  curMsgIndex: 0,
});
// 上传后得到的url
const fileList = ref<
  {
    name: '';
    url: '';
  }[]
>([]);

// 存储文件地址
const uploadFileUrl = ref<string>('');

// 文件上传实例
const uploadRef = ref<UploadInstance>();

const devStore = useDevStore();

const $emit = defineEmits(['savePlugin']);

const props = defineProps(['editedPluginValue']);

const cusInputText = reactive<{
  [key: string]: any;
}>({});

// 输入框提示
const restaurants = ref<{ value: string }[]>([]);

const curGroup = ref('');
const curFriend = ref('');
const tipsText = ref('');

const curEditedImage = ref(0);

const messageData = ref<messageType[]>([]);

const pluginData = ref<pluginType>({
  id: '',
  event: 'message',
  reg: '',
  cron: '',
  delayTime: 0,
  flag: '',
  isGlobal: true,
  isAt: false,
  isQuote: false,
  groups: [],
  friends: [],
  message: [],
});

const messageSeg = ref([
  {
    type: '代码',
    default: {
      type: 'code',
      data: codeTip(),
      hash: '',
    },
  },
  {
    type: '文本',
    default: {
      type: 'text',
      data: '',
    },
  },
  {
    type: '图片',
    default: {
      type: 'image',
      url: '',
      data: '',
      hash: '',
      json: '',
    },
  },
  {
    type: '音频',
    default: {
      type: 'record',
      url: '',
      data: '',
    },
  },
  {
    type: '视频',
    default: {
      type: 'video',
      url: '',
      data: '',
    },
  },
  {
    type: '表情',
    default: {
      type: 'face',
      data: 0,
    },
  },
  {
    type: '戳一戳',
    default: {
      type: 'poke',
      data: 0,
    },
  },
  {
    type: '骰子',
    default: {
      type: 'dice',
      data: 1,
    },
  },
  {
    type: '猜拳',
    default: {
      type: 'rps',
      data: 1,
    },
  },
  {
    type: 'Markdown',
    default: {
      type: 'markdown',
      content: markdownEl(),
    },
  },
  {
    type: '按钮',
    default: {
      type: 'button',
      content: {
        /** 机器人appid */
        appid: '',
        /** rows 数组的每个元素表示每一行按钮 */
        rows: [
          {
            buttons: [buttonEl()],
          },
        ],
      },
    },
  },
]);

const flagsList = ref([
  {
    desc: '默认Flags',
    value: '',
  },
  {
    desc: '(g)全局搜索',
    value: 'g',
  },
  {
    desc: '(i)不区分大小写',
    value: 'i',
  },
  {
    desc: '(m)多行搜索',
    value: 'm',
  },
  {
    desc: '(s)允许 . 匹配换行符',
    value: 's',
  },
  {
    desc: '(u)使用 unicode 码的模式进行匹配',
    value: 'u',
  },
  {
    desc: '(y)匹配从目标字符串的当前位置开始',
    value: 'y',
  },
]);

watch(
  () => props.editedPluginValue,
  newValue => {
    // 保证是修改模式
    if (devStore.curEditedMode == 'add') {
      pluginData.value.id = newValue.id;
      return;
    }
    if (Object.keys(newValue).length === 0) {
      console.log('对象没有自身属性');
    }
    pluginData.value = newValue;
    messageData.value = newValue.message;
    newValue.message?.forEach((seg: messageType, index: number) => {
      if (seg.type == 'text') {
        cusInputText['index' + index] = seg.data;
      }
    });
  },
  { immediate: true }
);

/**
 * 获取文件上传地址
 * @returns
 */
const handleFilePreview = (file: any) => {
  console.log(file);
  uploadFileUrl.value = file.url;

  dialogFormVisible.value = true;
};

/**
 * 文件上传成功回调
 * @returns
 */
const handleUploadSuccess: UploadProps['onSuccess'] = (res: any, uploadFile: any) => {
  console.log(res);
  console.log(uploadFile);
  messageData.value[extraUploadData.curMsgIndex]!.url = 'file://' + res.data;
};

/**
 * 文件过滤器
 * @returns
 */
const handleUpload: UploadProps['beforeUpload'] = rawFile => {
  if (extraUploadData.curType == 'image' && !rawFile.type.includes('image/')) {
    ElMessage.error('确保上传的是图片!');
    return false;
  } else if (extraUploadData.curType == 'record' && !rawFile.type.includes('audio/')) {
    ElMessage.error('确保上传的音频!');
    return false;
  } else if (extraUploadData.curType == 'video' && !rawFile.type.includes('video/')) {
    ElMessage.error('确保上传的是视频!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 100) {
    ElMessage.error('File size can not exceed 100MB!');
    return false;
  }
  return true;
};

/**
 * 上传资源
 * @returns
 */
const uploadFile = async (index: number, type: string) => {
  dialogFormVisible.value = true;
  let res: botURIResponseType = await reqBotWorkURI();
  if (res.code == 200) {
    let path = res.data.replace(/^file:\/\//, '');
    extraUploadData.path =
      path +
      'data/micro-plugin/plugins/' +
      (pluginData.value.id ? pluginData.value.id : devStore.curPluginId);
    extraUploadData.curType = type;
    extraUploadData.curMsgIndex = index;
  }
};

/**
 * 确认上传
 * @returns
 */
const confirmUpload = () => {
  uploadRef.value!.submit();
  dialogFormVisible.value = false;
};

/**
 * URI补全提示
 * @returns
 */
const querySearchTip = async (queryString: string, cb: any) => {
  let results;
  if (!queryString) {
    let res: botURIResponseType = await reqBotWorkURI();
    if (res.code == 200) {
      // console.log(res.data)
      restaurants.value = [
        {
          value: res.data,
        },
        {
          value: 'http://',
        },
        {
          value: 'https://',
        },
      ];
    }
  }
  results = restaurants.value;
  // call callback function to return suggestions
  cb(results);
};

/**
 * 添加群号
 * @returns
 */
const addGroups = () => {
  pluginData.value.groups.push(curGroup.value);
  curGroup.value = '';
};

/**
 * 删除群号
 * @param index
 * @returns
 */
const deleteGroupId = (index: number) => {
  pluginData.value.groups.splice(index, 1);
};

/**
 * 添加用户
 * @returns
 */
const addFriend = () => {
  pluginData.value.friends.push(curFriend.value);
  curFriend.value = '';
};

/**
 * 删除用户
 * @returns
 */
const deleteFriendId = (index: number) => {
  pluginData.value.friends.splice(index, 1);
};

/**
 * 制作图片
 * @returns
 */
const goPicEditor = async (index: number, seg: messageType) => {
  curEditedImage.value = index;
  devStore.scene = 2;
};

const onUpdateImageJson = async () => {
  if (devStore.curEditedMode == 'update') {
    const seg = messageData.value[curEditedImage.value as number];
    if (seg?.hash && !seg.json) {
      let res: any = await reqImageJson(pluginData.value.id, seg.hash as string);
      if (res.code == 200) {
        commands.updateContainer(JSON.parse(res.data));
      }
    } else if (seg?.hash && seg?.json) {
      commands.updateContainer(JSON.parse(seg!.json));
    }
  }
};

/**
 * 返回
 * @returns
 */
const goBack = () => {
  devStore.scene = 0;
  devStore.isPluginEdited = false;
};

/**
 * 保存编辑的插件
 * @returns
 */
const savePlugin = async () => {
  pluginData.value.message = messageData.value;

  let res: pluginResponseType;

  if (devStore.curEditedMode == 'add') {
    res = await reqAddPlugin(pluginData.value);
    ElMessage.success('添加成功！');
  } else {
    if (pluginData.value.id == '') {
      ElMessage.error('当前的插件id未知，无法保存！');
      return;
    }
    res = await reqEditorPlugin(pluginData.value.id, pluginData.value);
    ElMessage.success('修改成功！');
  }
  console.log(res);
  if (res.code == 200) {
    $emit('savePlugin', res.data);
    devStore.scene = 0;
    devStore.isPluginEdited = false;
  }
  // validator()
};

/**
 * 获取文字消息文本
 * @returns
 */
const setTextData = (e: string, index: number) => {
  messageData.value[index]!.data = e;
};

/**
 * 获取图片消息html和hash
 * @returns
 */
const setImageData = (e: { hash: string; data: string; json: string }) => {
  messageData.value[curEditedImage.value]!.data = e.data;
  messageData.value[curEditedImage.value]!.hash = e.hash;
  e.json && (messageData.value[curEditedImage.value]!.json = e.json);
};

/**
 * 保存代码段
 * @returns
 */
const saveCodeSeg = async ($event: string, seg: any) => {
  seg.data = $event;
  seg.hash = await getMD5Hash($event);
  ElMessage.success('保存代码段成功，可点击此页顶端保存按钮保存插件~');
};

/**
 * 进入update模式加载非html资源
 * @returns
 */
const loadResourcesData = async () => {
  if (devStore.curEditedMode == 'update') {
    if (
      messageData.value.find(
        item => item.type == 'button' || item.type == 'markdown' || item.type == 'code'
      )
    ) {
      let res: pluginElResponseType = await reqBtnJson(
        Object.assign(pluginData.value, { message: messageData.value })
      );
      if (res.code == 200) {
        pluginData.value = res.data;
        messageData.value = res.data.message;
      }
    }
  }
};

/**
 * 添加消息段
 * @returns
 */
const addMsgSegment = (msgSeg: messageType) => {
  // 这里添加临时id防止列表变动时索引丢失
  if (msgSeg.type == 'text') {
    if (messageData.value.find((seg: messageType) => seg.type == 'record' || seg.type == 'video')) {
      ElMessage.warning('无法在同一条消息中存在文本和该类型！');
      return;
    }
    messageData.value.push({
      type: 'text',
      data: '',
    });
  } else if (msgSeg.type == 'image') {
    if (messageData.value.find((seg: messageType) => seg.type == 'record' || seg.type == 'video')) {
      ElMessage.warning('无法在同一条消息中存在图片和该类型！');
      return;
    }
    messageData.value.push({
      type: 'image',
      url: '',
      data: '',
      hash: '',
    });
  } else if (msgSeg.type == 'face') {
    if (messageData.value.find((seg: messageType) => seg.type == 'record' || seg.type == 'video')) {
      ElMessage.warning('无法在同一条消息中存在表情和该类型！');
      return;
    }
    messageData.value.push({
      type: 'face',
      data: 0,
    });
  } else if (msgSeg.type == 'markdown') {
    if (messageData.value.some((seg: messageType) => seg.type !== 'button')) {
      ElMessage.warning('同一条消息中仅可存在该类型和按钮！');
      return;
    }
    messageData.value.push(msgSeg);
  } else {
    // 只能单独发送的情况
    if (messageData.value.length > 0) {
      ElMessage.warning('已添加的消息类型无法和其它消息类型共存！');
      return;
    }

    messageData.value.push(msgSeg);
  }
};

/**
 * 删除消息段
 * @returns
 */
const deleteMsgSeg = (index: number) => {
  messageData.value.splice(index, 1);
};

/**
 * 验证表单
 * @returns
 */
const validator = () => {
  tipsText.value = '';
  console.log(pluginData.value);
  if (!pluginData.value.reg) {
    tipsText.value += '· 正则表达式为空会导致插件响应所有消息，您确定吗？\n';
  }
  if (pluginData.value.message.length == 0) {
    tipsText.value += '· 消息段内容不能为空，您至少添加一种消息类型！！！';
  }
  if (tipsText.value == '') {
    devStore.scene = 0;
    devStore.isPluginEdited = false;
  }
  openTip(tipsText.value);
};

/**
 * 验证提示
 * @returns
 */
const openTip = (tip: string, type = 'waring') => {
  ElMessageBox.confirm(tip, type, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Save successfully!',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Canceled',
      });
    });
};

onMounted(() => {
  // getBotURI()
  loadResourcesData();
});
</script>

<style scoped lang="scss">
.title_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

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

.input_box {
  display: flex;
  width: 100%;
  justify-content: space-between;
  max-width: 100%;
}

.seg_card_box {
  display: block;
  width: 100%;

  .seg-card-form {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}

.demo-image__lazy {
  // border: 2px solid red;
  height: 300px;
  overflow-y: scroll;
}

.demo-image__lazy .el-image {
  display: flex;
  height: 10px;
  width: 10px;
  justify-content: space-around;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}

.face-box {
  width: 100%;
  height: 300px;
  overflow-y: scroll;
  cursor: pointer;

  .face-image {
    width: 25px;
    height: 25px;
  }
}

.pic_editor {
  height: calc(100vh - 60px);
}
</style>
