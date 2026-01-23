<template>
  <div class="fakeqq-msglist">
    <div class="msglist__tabbar" v-if="!devStore.isPortrait" ref="tabbarRef">
      <!-- 导航栏头像 -->
      <div class="msglist__tabbar__avatar" v-if="!devStore.isPortrait">
        <img class="msglist__tabbar__avatar__img" :src="`${avatar}`" />
        <div class="msglist__tabbar__avatar__state" :style="{ backgroundColor: `#2CEA8C` }"></div>
      </div>
      <!-- 导航栏顶端 -->
      <div class="msglist__tabbar__top">
        <div
          class="msglist__tabbar__top__icon"
          :class="[curTabbarIcon == 'messages' ? 'msglist__tabbar__top__icon__selected' : '']"
          @click="clickTabbarIcon('messages')"
        >
          <svg-icon name="message" width="80px" height="80px" color="black" />
          <el-badge
            v-if="messagesLength > 0"
            :value="messagesLength"
            :max="99"
            :style="{
              position: 'absolute',
              top: '10px',
              right: '-10px',
              transform: 'scale(0.8)',
            }"
          ></el-badge>
        </div>
        <div
          class="msglist__tabbar__top__icon"
          :class="[curTabbarIcon == 'contacts' ? 'msglist__tabbar__top__icon__selected' : '']"
          @click="clickTabbarIcon('contacts')"
        >
          <svg-icon name="contacts" width="26px" height="26px" color="black" />
        </div>
        <!-- <div class="msglist__tabbar__top__icon" @click="$emit('clickTabbar','contacts')">
                    <svg-icon name="channel" width="20px" height="26px" color="black"/>
                </div> -->
      </div>
      <!-- 导航栏底部 -->
      <div class="msglist__tabbar__bottom">
        <div
          class="msglist__tabbar__bottom__icon"
          :class="[curTabbarIcon == 'settings' ? 'msglist__tabbar__top__icon__selected' : '']"
          @click="clickTabbarIcon('settings')"
        >
          <el-icon size="26"><Expand /></el-icon>
        </div>
      </div>
    </div>

    <!-- 列表栏 -->
    <div
      class="msglist__messages"
      ref="messagesRef"
      v-if="!devStore.isPortrait || (devStore.isPortrait && devStore.qqScene == 0)"
    >
      <div class="msglist__messages__search" v-if="searchHeaderVisible">
        <div class="msglist__messages__search__frame">
          <div class="msglist__messages__search__frame__left">
            <el-icon size="large" color="#9F9F9F" @click="$emit('searchText', searchText)"
              ><Search
            /></el-icon>
            <input
              class="msglist__messages__search__frame__input"
              v-model="searchText"
              placeholder="搜索"
              @keyup.enter="$emit('searchText', searchText)"
              @input="$emit('searchText', searchText)"
              @focus="$emit('searchFocused', true)"
              @blur="$emit('searchFocused', false)"
            />
          </div>
          <el-popover
            placement="top-end"
            :width="140"
            trigger="click"
            v-model:visible="isAddMenuVisible"
          >
            <template #reference>
              <div class="msglist__messages__search__frame__right">
                <el-icon size="large" color="#9F9F9F"><Plus /></el-icon>
              </div>
            </template>
            <div class="msglist__messages__menu__add">
              <div
                class="msglist__messages__menu__add__item"
                @click="$emit('clickAdd', 'create-group')"
              >
                <svg-icon name="create-group" width="16px" height="16px"></svg-icon>
                <span class="msglist__messages__menu__item__desc">创建群聊</span>
              </div>
              <div
                class="msglist__messages__menu__add__item"
                @click="$emit('clickAdd', 'create-friend')"
              >
                <svg-icon name="add-friend" width="16px" height="16px"></svg-icon>
                <span class="msglist__messages__menu__item__desc">创建好友</span>
              </div>
              <!-- <div class="msglist__messages__menu__add__item" @click="$emit('clickAdd','add-contact')">
                                <svg-icon name="add-friend" width="16px" height="16px"></svg-icon>
                                <span class="msglist__messages__menu__item__desc">加好友/群</span>
                            </div> -->
            </div>
          </el-popover>
        </div>
      </div>

      <slot name="messages"></slot>

      <!-- 竖屏时导航栏 -->
      <div class="portrait__msglist__tabbar" v-if="devStore.isPortrait">
        <div
          class="portrait__msglist__tabbar__icon"
          :class="[curTabbarIcon == 'messages' ? 'portrait__msglist__tabbar__icon__selected' : '']"
          @click="clickTabbarIcon('messages')"
        >
          <svg-icon name="message" width="40px" height="40px" color="black" />
          <el-badge
            v-if="messagesLength > 0"
            :value="messagesLength"
            :max="99"
            :style="{
              position: 'absolute',
              top: '10px',
              right: '-10px',
              transform: 'scale(0.8)',
            }"
          ></el-badge>
        </div>
        <div
          class="portrait__msglist__tabbar__icon"
          :class="[curTabbarIcon == 'contacts' ? 'portrait__msglist__tabbar__icon__selected' : '']"
          @click="clickTabbarIcon('contacts')"
        >
          <svg-icon name="contacts" width="26px" height="26px" color="black" />
        </div>
        <div
          class="portrait__msglist__tabbar__icon"
          :class="[curTabbarIcon == 'settings' ? 'portrait__msglist__tabbar__icon__selected' : '']"
          @click="clickTabbarIcon('settings')"
        >
          <el-icon size="26"><Expand /></el-icon>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="msglist__messages__main__resizer" v-if="!devStore.isPortrait">
      <div
        class="msglist__messages__main__resizer__extend"
        ref="dividerRef"
        @mousedown="startDragDivider"
      ></div>
    </div>

    <!-- 主视图 -->
    <div
      class="msglist-main"
      ref="mainRef"
      v-if="!devStore.isPortrait || (devStore.isPortrait && devStore.qqScene !== 0)"
    >
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useDevStore from '@/store/modules/dev';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const $emit = defineEmits(['clickTabbar', 'clickAdd', 'searchText', 'searchFocused']);
const devStore = useDevStore();

const props = defineProps({
  avatar: { type: String, required: true },
  title: { type: String, required: true },
  // searchText: { type: String, default: ''},
  messagesLength: { type: Number, default: 0 },
  // state: { type: String, default: '离线' },
  searchHeaderVisible: { type: Boolean, default: true },
});

/** 添加操作栏 */
const isAddMenuVisible = ref(false);

/** 搜索栏值 */
const searchText = ref('');

/** 当前导航栏状态 */
const curTabbarIcon = ref('messages');
/** 点击消息栏菜单按钮事件 */
const clickTabbarIcon = (type: string) => {
  $emit('clickTabbar', type);
  curTabbarIcon.value = type;
};

/** 处理分隔线移动 */
const isDividerDragging = ref(false);

const tabbarRef = ref();

const messagesRef = ref();

const dividerRef = ref();

const mainRef = ref();

const maxX = ref(1280);

/** 拖拽事件 */
const handleDragDivider = function (e: any) {
  if (isDividerDragging.value) {
    const x = e.clientX;
    const dividerWidth = dividerRef.value.offsetWidth;
    if (messagesRef.value.offsetWidth == 500) maxX.value = x;
    // console.log(maxX.value)
    if (x > maxX.value) return;
    mainRef.value.style.width = `${window.innerWidth - x - dividerWidth / 2}px`;
  }
};

/**
 * 开始拖拽
 * @returns
 */
const startDragDivider = function () {
  isDividerDragging.value = true;
  document.onmousemove = handleDragDivider;
};

/**
 * 停止拖拽
 * @returns
 */
const stopDragDivider = function () {
  isDividerDragging.value = false;
  window.onmousemove = null;
};

onMounted(() => {
  window.addEventListener('mouseup', stopDragDivider);
  devStore.isPortrait = window.innerWidth < window.innerHeight;
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopDragDivider);
});
</script>

<style lang="scss" scoped>
@use '@/style/variable.scss' as *;

.fakeqq-msglist {
  left: 0;
  top: 0;
  width: 100%;
  position: absolute;
  height: calc(100vh - $base-tabbar-height - 20px);
  display: flex;
  flex: 1;
  flex-shrink: 1;
  position: relative;
  background-color: rgb(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  .msglist__tabbar {
    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 54px;
    background-color: #e5e5e5;
    .msglist__tabbar__avatar {
      position: relative;
      margin-top: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      .msglist__tabbar__avatar__img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .msglist__tabbar__avatar__state {
        position: absolute;
        border: 2px solid #e5e5e5;
        width: 14px;
        height: 14px;
        right: 0;
        bottom: 0;
        border-radius: 50%;
      }
    }
    .msglist__tabbar__top {
      position: relative;
      width: 40px;
      .msglist__tabbar__top__icon {
        margin-top: 10px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .msglist__tabbar__top__icon:hover {
        background-color: #dcdcdc;
      }
      .msglist__tabbar__top__icon__selected {
        background-color: #dcdcdc;
      }
    }

    .msglist__tabbar__bottom {
      position: relative;
      width: 40px;
      margin-top: auto;
      .msglist__tabbar__bottom__icon {
        margin-top: 10px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .msglist__tabbar__bottom__icon:hover {
        background-color: #dcdcdc;
      }
    }
  }

  .msglist__messages {
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 260px;
    // max-width: 500px;
    flex: 1;
    height: 100%;
    .msglist__messages__search {
      position: relative;
      border: 0.1px solid rgba(220, 220, 220, 0.326);
      width: 100%;
      height: 60px;

      .msglist__messages__search__frame {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        margin-left: 10px;
        width: calc(100% - 20px);
        height: 30px;

        .msglist__messages__search__frame__left {
          position: relative;
          width: calc(100% - 40px);
          height: 30px;
          padding: 6px;
          border-radius: 5px;
          background-color: #e5e5e5;
          .msglist__messages__search__frame__input {
            position: relative;
            font-size: 14px;
            line-height: 14px;
            border: 0;
            background-color: transparent;
            width: calc(100% - 18px);
            height: 18px;
            bottom: 3px;
          }
        }

        .msglist__messages__search__frame__right {
          width: 30px;
          height: 30px;
          background-color: #e5e5e5;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
        }
        .msglist__messages__search__frame__right:hover {
          cursor: pointer;
        }
      }
    }
    .portrait__msglist__tabbar {
      position: relative;
      margin-top: auto;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-around;
      background-color: #f3f2f7;
      flex-direction: row;
      width: 100%;
      height: 54px;
      bottom: 0;

      .portrait__msglist__tabbar__icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      .portrait__msglist__tabbar__icon:hover {
        background-color: #dcdcdc;
      }
      .portrait__msglist__tabbar__icon__selected {
        background-color: #dcdcdc;
      }
    }
  }

  .msglist__messages__main__resizer {
    position: relative;
    background-color: #e5e5e5;
    height: 100%;
    width: 0.1px;
    margin: 0;
    padding: 0;
    .msglist__messages__main__resizer__extend {
      width: 10px;
      position: absolute;
      height: 100%;
      left: -5px;
      background-color: transparent;
      cursor: e-resize;
    }
  }

  .msglist-main {
    background-color: #e5e5e5;
    position: relative;
    width: 100%;
    height: 100%;
    flex-shrink: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .msglist-header {
    display: flex;
    padding: 12px 0;
    text-align: center;
    justify-content: flex-start;
    align-items: center;
    background-image: #f0f0f0;
    border-bottom: 1px solid #ffffff;
  }
  .msglist-footer__tabbar {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    height: 40px;
    width: 100%;
    background-color: #8b8b8b;
  }
}

.msglist__messages__menu__add {
  .msglist__messages__menu__add__item {
    height: 30px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding-left: 5px;
    .msglist__messages__menu__item__desc {
      margin-left: 5px;
    }
  }
  .msglist__messages__menu__add__item:hover {
    cursor: pointer;
    background-color: #f2f2f2;
  }
}

.el-popover.el-popper {
  padding: 5px !important;
}

@media (orientation: portrait) {
  .msglist__messages {
    width: 100%;
    max-width: 100vw;
  }
}
</style>
