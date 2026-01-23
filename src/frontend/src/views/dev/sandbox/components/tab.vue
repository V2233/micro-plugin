<template>
  <ul id="nav" class="nav">
    <li class="slide1" ref="slide1"></li>
    <li class="slide2" ref="slide2"></li>
    <li>
      <a
        href="#"
        @click.prevent="handleClick"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        >好友</a
      >
    </li>
    <li>
      <a
        href="#"
        @click.prevent="handleClick"
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        >群聊</a
      >
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const slide1 = ref();
const slide2 = ref();

// 用于存储当前激活的链接索引
let activeIndex = 0; // 假设初始激活的是第三个链接（索引从0开始）

// 处理链接点击
const handleClick = (event: any) => {
  const targetLi = event.target.closest('li');
  const index = Array.from(targetLi.parentElement.children).indexOf(targetLi);
  activeIndex = index;

  // 更新slide1的位置和宽度
  updateSlide(slide1, targetLi);
  $emit('change', activeIndex - 2);
};

// 处理鼠标悬停
const handleMouseOver = (event: any) => {
  const targetLi = event.target.closest('li');
  updateSlide(slide2, targetLi, true); // 传递true表示是slide2
};

// 处理鼠标移出
const handleMouseOut = () => {
  slide2.value.style.opacity = '0';
  slide2.value.classList.remove('squeeze');
};

// 更新slide的位置和宽度
const updateSlide = (slideRef: any, targetLi: any, isSlide2 = false) => {
  if (!slideRef.value || !targetLi) return;

  // const rect = targetLi.getBoundingClientRect();
  // slideRef.value.style.opacity = '1';
  // slideRef.value.style.left = `${rect.left - slideRef.value.parentElement.offsetLeft}px`; // 减去父元素的offsetLeft以确保正确定位
  // slideRef.value.style.width = `${rect.width}px`;

  // if (isSlide2) {
  //   slideRef.value.classList.add('squeeze');
  // }

  const navWidth = slideRef.value.parentElement.offsetWidth; // 获取导航栏的总宽度
  const index = Array.from(targetLi.parentElement.children).indexOf(targetLi); // 获取链接的索引
  const linkWidth = navWidth / 2; // 假设每个链接宽度相等，这里直接除以2

  // 计算滑块的left属性
  const left = (index - 2) * linkWidth; // 索引乘以每个链接的宽度

  slideRef.value.style.opacity = '1';
  slideRef.value.style.left = `${left + 5}px`;
  slideRef.value.style.width = `${linkWidth - 10}px`; // 设置滑块的宽度与链接相同

  if (isSlide2) {
    slideRef.value.classList.add('squeeze');
  }
};

const $emit = defineEmits(['change']);

// 组件挂载时初始化slide1
onMounted(() => {
  const activeLi = slide1.value.parentElement.children[activeIndex];
  updateSlide(slide1, activeLi);
});
</script>

<style scoped lang="scss">
#nav {
  width: 100%;
  position: relative;
  border: none;
  border-radius: 5px;
  display: flex;
  list-style: none;
  background: #f5f5f5;
  padding: 5px;
}

#nav li {
  // border: 2px solid red;
  width: calc(100% / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}

#nav li a {
  position: relative;
  // padding: 4px 48px;
  padding-top: 4px;
  padding-bottom: 4px;
  font: 500 16px '优设标题黑';
  border: none;
  outline: none;
  color: rgb(70, 100, 180);
  display: inline-block;
  text-decoration: none;
  z-index: 3;
}

.slide1,
.slide2 {
  // border: 2px solid red;
  position: absolute;
  display: inline-block;
  height: 30px;
  border-radius: 5px;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1.05);
}

.slide1 {
  background-color: rgb(255, 255, 255);
  z-index: 2;
}

.slide2 {
  opacity: 0;
  background-color: #d8f1ff;
  z-index: 1;
  box-shadow: 0 0 10px #ffffffaa inset;
}

.squeeze {
  transform: scale(0.9);
}
</style>
