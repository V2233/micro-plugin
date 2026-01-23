<template>
  <!-- 表格视图 -->
  <el-card
    v-show="scene == 0"
    class="box-card"
    ref="cardRef"
    :body-style="{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }"
  >
    <!-- 路径搜索栏 -->
    <div class="search_bar">
      <!-- 左侧 -->
      <div style="width: 100%; margin-right: 10px">
        <el-input
          v-model="curPath"
          style="max-width: 600px; width: 100%; min-width: 200px"
          class="input-with-select"
        >
          <template #prepend>
            <el-button icon="Back" @click="goBackDir" />
          </template>
          <template #append>
            <el-button icon="DArrowRight" @click="goCustomDir"></el-button>
          </template>
        </el-input>
      </div>
      <!-- 右侧 -->
      <div class="search_file">
        <!-- 搜索文件按钮 -->
        <el-popover placement="bottom" title="搜索" :width="300" trigger="hover">
          <el-input v-model="searchText" placeholder="输入搜索文件或目录">
            <template #append>
              <el-button icon="Search" @click="searchFile"></el-button>
            </template>
          </el-input>
          <template #reference>
            <el-button icon="Search" circle></el-button>
          </template>
        </el-popover>
      </div>
    </div>

    <!-- 操作导航 -->
    <div class="handle_tabbar" style="margin-top: 10px">
      <el-button
        size="small"
        style="margin-right: 5px"
        :icon="isMutiChecked ? 'ArrowLeftBold' : 'ArrowRightBold'"
        @click="isMutiChecked = !isMutiChecked"
      ></el-button>
      <el-select size="small" placeholder="新建" style="width: 60px" @change="changeCreateMode">
        <el-option label="目录" value="目录" />
        <el-option label="文件" value="文件" />
      </el-select>
      <el-button
        v-if="tempDirStorage.length > 0 && tempDirStorage.every(item => item.handlerMode)"
        type="primary"
        @click="pasteFileOrDir()"
        size="small"
        style="margin-left: 5px"
      >
        粘贴
      </el-button>

      <el-button
        v-if="tempDirStorage.length > 0"
        :disabled="tempDirStorage.every(item => item.handlerMode == '复制')"
        type="primary"
        @click="fileSelectedHandler('复制')"
        size="small"
        style="margin-left: 5px"
      >
        复制
      </el-button>

      <el-button
        v-if="tempDirStorage.length > 0"
        :disabled="tempDirStorage.every(item => item.handlerMode == '移动')"
        type="primary"
        @click="fileSelectedHandler('移动')"
        size="small"
        style="margin-left: 5px"
      >
        移动
      </el-button>

      <el-button @click="openUploader" size="small" style="margin-left: 5px"> 上传 </el-button>

      <el-button @click="openTerminal" size="small" style="margin-left: 5px"> 终端 </el-button>
    </div>
    <!-- 文件表格 -->
    <el-table
      v-loading="loading"
      style="margin-top: 10px"
      :data="orderedDir"
      max-height="114514"
      @selection-change="handleFileSelected"
      @click="clearPopMenu"
    >
      <el-table-column type="selection" align="center" v-if="isMutiChecked"></el-table-column>
      <el-table-column label="文件名称">
        <template #header>
          <div class="title-active" @click="changeOrder('name')">文件名称</div>
        </template>
        <template #="{ row, $index }">
          <!-- 包裹菜单 -->
          <el-popover
            placement="bottom"
            :title="row.type == 'file' ? '文件操作' : '文件夹操作'"
            :width="150"
            trigger="contextmenu"
            :visible="row.isRightClicked"
          >
            <span class="pop_menu" v-for="(popItem, id) in popMenuArr" :key="id">
              <el-popconfirm
                v-if="popItem.name == '删除'"
                :title="`您即将删除路径【${row.path}】,是否继续？`"
                @confirm="handlePopMenu(row, popItem)"
              >
                <template #reference>
                  <el-button>{{ popItem.name }}</el-button>
                </template>
              </el-popconfirm>
              <el-button v-else @click="handlePopMenu(row, popItem)">
                {{ popItem.name }}
              </el-button>
            </span>
            <template #reference>
              <!-- 表格文件名 -->
              <div @contextmenu.prevent="handleRightClick(row)">
                <i
                  :class="`iconfont icon-file 
                                          icon-${
                                            row.type == 'file'
                                              ? row.name.split('.').at(-1)
                                              : 'yellowFolder'
                                          }
                                      `"
                  style="font-size: 20px"
                ></i>
                &nbsp;
                <a v-if="!row.isBlur" @click="getChildDir(row)">
                  {{ row.name }}
                </a>
                <el-input
                  v-else
                  :ref="
                    (vc: any) => {
                      inputRefObj[row.name.replace(/\./g, '') + row.type] = vc;
                    }
                  "
                  @blur="createFile(row, 'blur')"
                  @keyup.enter="createFile(row, 'enter')"
                  v-model="row.name"
                ></el-input>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="80px">
        <template #="{ row, $index }">
          <div @contextmenu.prevent="handleRightClick(row)" style="font-size: 12px">
            <span v-if="row.size">{{ row.size }}</span>
            <a v-else @click="getFilesSize(row)">计算</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #header>
          <div class="title-active" @click="changeOrder('time')">修改时间</div>
        </template>
        <template #="{ row, $index }">
          <div @contextmenu.prevent="handleRightClick(row)" style="font-size: 12px">
            {{ row.mtime.replace(/T/, ' ').replace(/\.\d{3}Z/, '') }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-card v-show="scene == 1">
    <el-button style="margin-bottom: 5px" @click="scene = 0"> 返回 </el-button>
    <Editor :code="fileContent" :ext="ext" @getCode="saveFile" />
  </el-card>

  <!-- 已废弃 -->
  <!-- <el-card v-if="scene == 2">
    <el-button style="margin-bottom: 5px" @click="scene = 0">
      <el-icon>
        <Back />
      </el-icon>
    </el-button>
    <Terminal :dirPath="curPath" />
  </el-card> -->

  <!--    <el-pagination
              v-model:current-page="pageNo"
              v-model:page-size="limit"
              
              :page-sizes="[3, 5, 7, 9]"
              :disabled="false"
              :background="true"
              layout="prev, pager, next, jumper, ->, sizes, total"
              :total="total"
              @current-change="getHasTrademark"
              @size-change="sizeChange"
          />
      </el-card> -->

  <!-- 富媒体展示和上传 -->
  <el-dialog v-model="dialogFormVisible" :title="curPathObj.name">
    <div v-if="dialogMode == 'upload'" class="file_upload_box">
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
    </div>

    <!-- 图片控件 -->
    <div v-if="dialogMode == 'viewImage'">
      <el-image :src="imageUrl" lazy />
    </div>

    <!-- 音频控件 -->
    <div
      v-if="dialogMode == 'viewAudio'"
      :style="{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }"
    >
      <audio
        ref="audioElement"
        controls
        :src="audioUrl"
        style="width: 100%"
        @ended="handleMediaPlayEnded"
      ></audio>
    </div>

    <!-- 视频控件 -->
    <div v-if="dialogMode == 'viewVideo'" style="width: 100; max-height: 100%">
      <video controls ref="videoElement" style="width: 100%; height: 100%; object-fit: cover">
        <source :src="videoUrl" type="video/mp4" />
        <source :src="videoUrl" type="video/ogg" />
      </video>
    </div>

    <template #footer v-if="dialogMode == 'upload'">
      <el-button type="primary" size="default" @click="confirmUpload"> 确认提交 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
//@ts-ignore
import * as reqFs from '@/api/dev/fs/index';
import useLayoutSettingStore from '@/store/modules/setting';
import type { UploadInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import Editor from './codeEditor.vue';

interface dirObjType {
  name: string;
  mtime: string;
  type: string;
  size?: string | number;
  path: string;
  // 辅助属性
  isBlur?: boolean;
  isRightClicked?: boolean;
  handlerMode?: string;
}

interface popMenuType {
  name: string;
}

const layoutSettingStore = useLayoutSettingStore();

// 表格加载
const loading = ref(false);

// 文件拓展名
const ext = ref('');

// 媒体url
const imageUrl = ref('');
const audioUrl = ref('');
const videoUrl = ref('');

// 音视频是否正在播放
const isAudioOrVideoPlaying = ref<boolean>(false);

// 对话框显示或隐藏
const dialogFormVisible = ref<boolean>(false);
const dialogMode = ref<string>('');

// 文件上传实例
const uploadRef = ref<UploadInstance>();

// 音视频文件实例
const audioElement = ref<HTMLAudioElement>();
const videoElement = ref<HTMLVideoElement>();

// 文件上传路径
let extraUploadData = reactive({
  path: '',
});

// 临时存储文件节点
let curPathObj = reactive<dirObjType>({
  name: '',
  mtime: '',
  type: '',
  size: '',
  path: '',
  isBlur: false,
  isRightClicked: false,
});

// 右键操作菜单设置
let popMenuArr = ref<popMenuType[]>([
  {
    name: '删除',
  },
  {
    name: '上传',
  },
  {
    name: '移动',
  },
  {
    name: '下载',
  },
  {
    name: '复制',
  },
  {
    name: '命名',
  },
]);

// 当前文件夹路径
let curPath = ref('0');

// 当前文件夹数组
let curDir = ref<dirObjType[]>([]);

let isMutiChecked = ref<boolean>(false);

// 排序依据
let orderType = ref('name');
let isReverse = ref<boolean>(false);

// 搜索文件关键词
let searchText = ref<string>('');

// 存储读取的文件
let fileContent = ref<string>('');

// 控制场景显示 (0:文件列表；1:编辑器；2:终端)
// let isEditored = ref<boolean>(false)
let scene = ref(0);

// 避免回车触发blur
// let enterPressed = ref<boolean>(false)

// 存储待复制或移动的节点
let tempDirStorage = ref<dirObjType[]>([]);

// 标识文件名ref
let inputRefObj = ref<any>({});

// 缓存重命名
let tempFileName = ref<string>('');

// 存储文件地址
let uploadFileUrl = ref<string>('');
let fileList = ref<
  {
    name: '';
    url: '';
  }[]
>([]);

/**
 * 获取目录节点
 * @param path 路径
 * @returns
 */
const getDir = async (path = '0') => {
  loading.value = true;
  let res: any = await reqFs.reqListDir(path);
  if (res.code == 200) {
    curDir.value = res.data.children;
    curPath.value = res.data.path;
    loading.value = false;
  }
};

/**
 * 获取文件夹大小
 * @param path 路径
 * @returns
 */
const getFilesSize = async (row: dirObjType) => {
  let res: any = await reqFs.reqFilesSize(row.path, row.type);
  if (res.code == 200) {
    row.size = res.data;
  }
};

/**
 * 计算排序属性
 * @returns
 */
const orderedDir = computed(() => {
  let res: any = [];
  if (orderType.value == 'name') {
    let dirs: dirObjType[] = [];
    let files: dirObjType[] = [];
    curDir.value.forEach((item: any) => {
      if (item.type == 'file') {
        files.push(item);
      } else {
        dirs.push(item);
      }
    });
    res = [...dirs, ...files];
  } else if (orderType.value == 'time') {
    res = curDir.value.slice().sort((a: dirObjType, b: dirObjType) => {
      const dateA = new Date(a.mtime).getTime();
      const dateB = new Date(b.mtime).getTime();
      return dateA - dateB;
    });
  } else {
    res = curDir.value;
  }

  if (isReverse.value) {
    return res.reverse();
  } else {
    return res;
  }
});

/**
 * 改变排序依据
 * @param type 时间或名称
 * @returns
 */
const changeOrder = (type: string) => {
  if (type == 'name') {
    if (orderType.value == 'name') {
      isReverse.value = !isReverse.value;
    } else {
      orderType.value = 'name';
      isReverse.value = false;
    }
  } else if (type == 'time') {
    if (orderType.value == 'time') {
      isReverse.value = !isReverse.value;
    } else {
      orderType.value = 'time';
      isReverse.value = false;
    }
  }
};

/**
 * 回退路径
 * @returns
 */
const goBackDir = () => {
  let lastSepIndex = curPath.value.lastIndexOf('/');
  if (lastSepIndex == -1) {
    lastSepIndex = curPath.value.lastIndexOf('\\');
  }
  curPath.value = curPath.value.slice(0, lastSepIndex);
  getDir(curPath.value);
};

/**
 * 进入搜索路径
 * @returns
 */
const goCustomDir = () => {
  getDir(curPath.value);
};

/**
 * 搜索文件
 * @returns
 */
const searchFile = async () => {
  let res: any = await reqFs.reqSearchFs(curPath.value, searchText.value);
  searchText.value = '';
  if (res.code == 200) {
    curDir.value = res.data;
    // getDir(res.data)
  }
};

/**
 * 获取文件拓展名
 * @returns
 */
const getFileExtension = (filename: string) => {
  // 查找最后一个点的索引
  const lastIndex = filename.lastIndexOf('.');

  // 如果没有找到点（即没有扩展名），则返回null或空字符串
  if (lastIndex === -1) return 'js';

  // 提取并返回扩展名（包括点）
  return filename.substring(lastIndex + 1);
};

/**
 * 进入子目录或打开文件
 * @returns
 */
const getChildDir = async (row: dirObjType) => {
  // 打开文件情况
  if (row.type == 'file') {
    Object.assign(curPathObj, row);
    if (/\.(png|jpg|jpeg|gif|bmp|tiff|webp|svg)$/.test(row.name)) {
      let res: any = await reqFs.reqReadMediaFile(row.path);
      imageUrl.value = URL.createObjectURL(res);
      dialogMode.value = 'viewImage';
      dialogFormVisible.value = true;
      return;
    }
    if (
      /\.(mp3|wav|aac|m4a|ogg|flac|wma|ape|alac|amr|awb|aiff|caf|mka|opus|ra|rm|spx|tta|voc|wavpack|xm|mod|s3m|it|xmf|mid|midi|kar|rmi)$/.test(
        row.name
      )
    ) {
      let res: any = await reqFs.reqReadMediaFile(row.path);
      audioUrl.value = URL.createObjectURL(res);
      dialogMode.value = 'viewAudio';
      dialogFormVisible.value = true;
      return;
    }
    if (/\.(mp4|avi|mov|wmv|mpeg|flv|mkv|vob|3gp|webm|m4v)$/.test(row.name)) {
      let res: any = await reqFs.reqReadMediaFile(row.path);
      videoUrl.value = URL.createObjectURL(res);
      dialogMode.value = 'viewVideo';
      dialogFormVisible.value = true;
      return;
    }
    // dialogFormVisible.value = true
    let res: any = await reqFs.reqReadFile(row.path);
    if (res.code == 200) {
      // isEditored.value = true
      scene.value = 1;
      fileContent.value = res.data;
      ext.value = getFileExtension(row.name);
    }
    return;
  }
  getDir(row.path);
};

/**
 * 保存文件
 * @returns
 */
const saveFile = async (code: string) => {
  let res: any = await reqFs.reqSaveFile(curPathObj.path, code.toString());
  if (res.code == 200) {
    ElMessage.success('保存成功！');
    // isEditored.value = false
    scene.value = 0;
    fileContent.value = '';
  }
};

/**
 * 获取新建模式
 * @returns
 */
const changeCreateMode = (mode: string) => {
  if (mode == '文件') {
    curDir.value.unshift({
      name: '',
      mtime: '',
      type: 'file',
      size: '',
      path: curPath.value,
      isBlur: true,
    });
  } else if (mode == '目录') {
    curDir.value.unshift({
      name: '',
      mtime: '',
      type: 'directory',
      size: '',
      path: curPath.value,
      isBlur: true,
    });
  }
  let tempFile = curDir.value.find((item: dirObjType) => item.isBlur == true) as dirObjType;

  nextTick(() => {
    inputRefObj.value[tempFile.name.replace(/\./g, '') + tempFile.type].focus();
  });
};

/**
 * 属性值去重
 * @returns
 */
const hasDuplicatePropertyValue = (arr: any, propertyName: string) => {
  const valueSet = new Set();

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i][propertyName];
    if (valueSet.has(value)) {
      return true; // 发现重复值
    }
    valueSet.add(value);
  }

  return false; // 没有发现重复值
};

/**
 * Blur回调创建文件或文件夹
 * @returns
 */
const createFile = async (row: any, eMode: string = 'blur', type = 'create') => {
  row.isBlur = false;

  // if (eMode == 'enter') {
  //   return
  // }

  if (!row.name) {
    row.name = '新建标题';
  }

  // 判断row.name是否存在
  let isFileExisted = hasDuplicatePropertyValue(curDir.value, 'name');
  if (isFileExisted) {
    ElMessage.error('该标题已存在！！');
    getDir(curPath.value);
    return;
  }

  let res: any;

  if (row.handlerMode == '命名') {
    type = 'rename';
  }

  if (type == 'create') {
    if (row.type == 'file') {
      res = await reqFs.reqSaveFile(curPath.value + '/' + row.name, '');
    } else {
      res = await reqFs.reqMkdir(curPath.value + '/' + row.name);
    }
  } else if (type == 'rename') {
    res = await reqFs.reqRenameFile(
      curPath.value + '/' + tempFileName.value,
      curPath.value + '/' + row.name
    );
    row.handlerMode == '';
  }

  if (res.code == 200) {
    getDir(curPath.value);
  }
};

/**
 * 删除文件回调
 * @returns
 */
const rmFile = async (row: any) => {
  let res: any;
  if (row.type == 'file') {
    res = await reqFs.reqRmFile(row.path);
  } else {
    res = await reqFs.reqRmDir(row.path);
  }

  if (res.code == 200) {
    console.log(res);
    getDir(curPath.value);
  }
};

/**
 * 移动文件
 * @returns
 */
const setDirStorage = async (row: any) => {
  tempDirStorage.value.push(row);
};

/**
 * 粘贴逻辑
 * @returns
 */
const pasteFileOrDir = async () => {
  for (let i = 0; i < tempDirStorage.value.length; i++) {
    let item: dirObjType = tempDirStorage.value[i] as dirObjType;
    let res: any;
    if (item.handlerMode == '移动') {
      res = await reqFs.reqMoveFile(item.path, curPath.value + '/' + item.name);
    } else if (item.handlerMode == '复制') {
      if (item.type == 'file') {
        // 文件复制api
        res = await reqFs.reqCopyFile(item.path, curPath.value + '/' + item.name);
      } else {
        // 文件移动api
        res = await reqFs.reqCopyDir(item.path, curPath.value + '/' + item.name);
      }
    } else {
      ElMessage.error('请选择右侧操作');
    }

    if (res.code == 200) {
      // console.log(res.data)
      ElMessage.success('粘贴成功！');
    }
  }

  tempDirStorage.value = [];
  getDir(curPath.value);
};

/**
 * 文件重命名
 * @returns
 */
const renameFileOrDir = (row: dirObjType) => {
  tempFileName.value = row.name;
  row.isBlur = true;
  nextTick(() => {
    inputRefObj.value[row.name.replace(/\./g, '') + row.type].focus();
  });
};

/**
 * 右键弹出菜单并清除旧的菜单
 * @returns
 */
const handleRightClick = (row: any) => {
  // console.log(row)
  for (let i = 0; i < curDir.value.length; i++) {
    curDir.value[i]!.isRightClicked = false;
  }
  row.isRightClicked = true;
};

/**
 * 清理气泡菜单
 * @returns
 */
const clearPopMenu = () => {
  for (let i = 0; i < curDir.value.length; i++) {
    curDir.value[i]!.isRightClicked = false;
  }
};

/**
 * 打开上传对话框
 * @returns
 */
const openUploader = () => {
  extraUploadData.path = curPath.value;
  dialogMode.value = 'upload';
  dialogFormVisible.value = true;
};

/**
 * 打开终端
 * @returns
 */
const openTerminal = () => {
  if (layoutSettingStore.globalTerminal.running) {
    if (layoutSettingStore.globalTerminal.visible == false) {
      layoutSettingStore.globalTerminal.visible = true;
    }
  } else {
    layoutSettingStore.globalTerminal.running = true;
    layoutSettingStore.globalTerminal.visible = true;
  }
};

/**
 * 右键相关操作
 * @returns
 */
const handlePopMenu = (row: dirObjType, popItem: popMenuType) => {
  row.isRightClicked = false;
  switch (popItem.name) {
    case '删除':
      rmFile(row);
      break;
    case '移动':
      row.handlerMode = '移动';
      setDirStorage(row);
      break;
    case '复制':
      row.handlerMode = '复制';
      setDirStorage(row);
      break;
    case '命名':
      row.handlerMode = '命名';
      renameFileOrDir(row);
      break;
    case '上传':
      row.handlerMode = '上传';
      openUploader();
      break;
    case '下载':
      row.handlerMode = '下载';
      handleDownload(row);
      break;
    default:
      ElMessage.error('右键相关操作出错了');
  }
};

/**
 * 文件多选
 * @returns
 */
const handleFileSelected = (selectedArr: dirObjType[]) => {
  // console.log(selectedArr)
  let isHandled = tempDirStorage.value.some(item => (item.handlerMode ? true : false));
  if (isHandled) {
    // ElMessage.error('您已选择操作，请粘贴或刷新取消！')
    return;
  }
  tempDirStorage.value = JSON.parse(JSON.stringify(selectedArr));
};

/**
 * 文件多选增加模式标记
 * @returns
 */
const fileSelectedHandler = (mode: string) => {
  for (let i = 0; i < tempDirStorage.value.length; i++) {
    tempDirStorage.value[i]!.handlerMode = mode;
  }
};

/**
 * 获取文件上传地址
 * @returns
 */
const handleFilePreview = (file: any) => {
  // console.log(file)
  uploadFileUrl.value = file.url;

  dialogFormVisible.value = true;
};

/**
 * 上传成功
 * @returns
 */
const handleUploadSuccess = (e: any) => {
  console.log(e);
  getDir(curPath.value);
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
 * 下载逻辑
 * @returns
 */
const handleDownload = async (row: dirObjType) => {
  console.log(row);
  if (row.type == 'file') {
    let res: any = await reqFs.reqDownload(row.path);

    ElMessage.success('开始下载...');
    // const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(res);
    link.download = row.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    ElMessage.warning('请下载文件或压缩包');
  }
};

/**
 * 控制媒体播放开关
 * @returns
 */
// const toggleAudioOrVideoPlay = () => {
//   if (audioElement.value) {
//     if (audioElement.value.paused) {
//       audioElement.value.play();
//       isAudioOrVideoPlaying.value = true;
//     } else {
//       audioElement.value.pause();
//       isAudioOrVideoPlaying.value = false;
//     }
//   }
// }

/**
 * 播放结束逻辑
 * @returns
 */
const handleMediaPlayEnded = () => {
  isAudioOrVideoPlaying.value = false;
};

/**
 * 文件过滤器
 * @returns
 */
const handleUpload = (file: any) => {
  // console.log(file)
};

onMounted(() => {
  getDir('0');
});
</script>

<style scoped lang="scss">
@use '@/assets/font-icon/iconfont.css' as *;

.box-card {
  height: 100%;
}

.title-active:hover {
  background-color: rgba(241, 248, 255, 0.75);
  cursor: pointer;
}

a:hover {
  color: green;
  cursor: pointer;
}

.search_bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border: 2px solid red */
}

.pop_menu {
  margin-bottom: 5px;
  margin-left: 2px;
  line-height: 2rem;
}
</style>
