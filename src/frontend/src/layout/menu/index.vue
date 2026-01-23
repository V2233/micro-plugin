<template>
  <div class="menu-wrapper">
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item
          v-if="!item.meta.hidden"
          :index="item.path"
          @click="goRoute"
          class="menu-item"
        >
          <el-icon class="menu-icon">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span class="menu-title">{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 只有一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
          class="menu-item"
        >
          <el-icon class="menu-icon">
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span class="menu-title">{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 有多个子路由 -->
      <template v-if="item.children && item.children.length > 1">
        <el-sub-menu v-if="!item.meta.hidden" :index="item.path" class="sub-menu">
          <template #title>
            <el-icon class="menu-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="menu-title">{{ item.meta.title }}</span>
          </template>
          <transition name="submenu-slide" mode="out-in">
            <Menu :menuList="item.children"></Menu>
          </transition>
        </el-sub-menu>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter();

defineProps(['menuList']);

const goRoute = (vc: any) => {
  $router.push(vc.index);
};
</script>

<script lang="ts">
export default {
  name: 'Menu',
};
</script>

<style scoped lang="scss">
.menu-wrapper {
  // 确保内部菜单项正确显示
  width: 100%;
}

.menu-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  &:hover {
    background-color: rgba(64, 158, 255, 0.1) !important;
  }

  &.is-active {
    background-color: rgba(64, 158, 255, 0.2) !important;
  }
}

.menu-icon {
  transition: all 0.3s;

  .menu-item:hover & {
    transform: scale(1.1) rotate(5deg);
  }
}

.menu-title {
  transition: all 0.3s;

  .menu-item:hover & {
    color: #409eff;
  }
}

.sub-menu {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// 子菜单展开动画
.submenu-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.submenu-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.submenu-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.submenu-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
