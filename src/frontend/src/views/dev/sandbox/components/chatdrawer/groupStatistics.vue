<template>
  <div class="group-statistics-card">
    <div class="group-statistics-card__title">{{ title }}</div>
    <div class="group-statistics-card__center">
      <el-icon :color="color" size="16">
        <component :is="icon"></component>
      </el-icon>
      <div
        class="group-statistics-card__center__number"
        :style="{
          color: color,
        }"
      >
        {{ percentage }}
      </div>
      <div
        class="group-statistics-card__center__per"
        :style="{
          color: color,
        }"
      >
        %
      </div>
    </div>
    <div class="group-statistics-card__bottom">
      <div
        class="group-statistics-card__bottom__bar"
        :style="{
          width: `${percentage}%`,
          backgroundColor: color,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '' },
  percentage: { type: Number, default: 0 },
});
</script>

<style lang="scss" scoped>
.group-statistics-card {
  width: 60px;
  .group-statistics-card__title {
    font-size: 12px;
    font-weight: 700px;
    color: #7f7f7f;
  }
  .group-statistics-card__center {
    display: flex;
    align-items: end;
    font-size: 18px;
    margin-top: 5px;
    .group-statistics-card__center__number {
      margin-left: 5px;
    }
    .group-statistics-card__center__per {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .group-statistics-card__bottom {
    height: 4px;
    width: 100%;
    margin-top: 5px;
    border-radius: 2px;
    background-color: #f2f2f2;
    .group-statistics-card__bottom__bar {
      height: 100%;
      border-radius: 2px;
      opacity: 0.6;
    }
  }
}
</style>
