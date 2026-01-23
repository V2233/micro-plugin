<template>
  <div class="seg-btn-content">
    <div class="seg-btn-coloum" v-for="(btnRow, btnRowId) in btnData.rows" :key="btnRowId">
      <div class="seg-btn-row-box">
        <div class="seg-btn-row" v-for="(btn, btnId) in btnRow.buttons">
          <el-button
            :type="btn.render_data.style == 1 ? 'primary' : ''"
            :plain="btn.render_data.style == 1 ? true : false"
            size="small"
            @click="clickBtn(btn, btnRowId as number, btnId as number)"
          >
            {{ btn.render_data.label }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps(['btnContent']);

const $emit = defineEmits(['update:btnContent', 'btnData']);

const btnData = ref();

const clickBtn = (btn: any, btnRowId: number, btnId: number) => {
  $emit('btnData', btn);
};

watch(
  () => props.btnContent,
  newValue => {
    btnData.value = newValue;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.seg-btn-content {
  width: 100%;
  border-radius: 5px;

  .seg-btn-coloum {
    width: 100%;

    .seg-btn-row-box {
      display: flex;
      width: 100%;
      justify-content: space-around;
      // border: 2px solid red;

      .seg-btn-row {
        width: 100%;
        padding: 0 2px;
        margin: 2px 0;
        .el-button {
          width: 100%;
          padding-left: 2px;
          padding-right: 2px;
        }
      }
    }
  }
}
</style>
