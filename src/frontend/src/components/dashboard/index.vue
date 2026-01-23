<template>
  <div class="box">
    <div class="top_box">
      <div class="top_title" :style="location == 'right' ? 'left: 40%; width: 60%;' : ''">
        <div class="title_box">
          <p class="title">{{ title }}</p>
          <p class="bg"></p>
        </div>
      </div>

      <div
        class="top_desc"
        :style="location == 'right' ? 'left: 0; width: 40%;' : 'left: 40%; width: 60%;'"
      >
        <slot name="desc"></slot>
      </div>
    </div>

    <div class="main">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['title', 'location']);
</script>

<style scoped lang="scss">
.box {
  background: url(./images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top_box {
    position: relative;
    width: 100%;
    height: 20%;
    .top_title {
      position: absolute;
      width: 40%;
      // border: 2px solid red;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .title_box {
        .title {
          color: white;
          font-size: 20px;
        }
        .bg {
          width: 100%;
          height: 7px;
          background: url(./images/dataScreen-title.png) no-repeat;
          margin-top: 10px;
        }
      }
    }
    .top_desc {
      height: 100%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
  }

  .main {
    height: 80%;
    width: 100%;
  }
}
</style>
