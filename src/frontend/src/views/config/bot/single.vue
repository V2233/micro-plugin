<template>
  <el-form>
    <el-form-item v-for="(item, key, index) in cfgData" :key="key" :lable="item.desc">
      <div class="sub-title">{{ item.desc }}</div>
      <el-input
        v-if="item.type == 'string'"
        v-model="item.value"
        @input="$emit('update:cfg', cfgData)"
      ></el-input>
      <el-input-number
        v-if="item.type == 'number'"
        v-model="item.value"
        @input="$emit('update:cfg', cfgData)"
      />
      <el-switch
        v-if="item.type == 'boolean'"
        v-model="item.value"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66"
        active-text="Y"
        inactive-text="N"
        @change="$emit('update:cfg', cfgData)"
      />
      <div v-if="item.type == 'array'">
        <el-input
          v-if="item.subType == 'string'"
          v-model="item.cur"
          size="small"
          @input="$emit('update:cfg', cfgData)"
        ></el-input>
        <el-input-number
          v-if="item.subType == 'number'"
          v-model="item.cur"
          @input="$emit('update:cfg', cfgData)"
          size="small"
        />
        <el-switch
          v-if="item.subType == 'boolean'"
          :value="item.cur"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66"
          active-text="Y"
          inactive-text="N"
          @change="((cfgData[key].cur = $event), $emit('update:cfg', cfgData))"
        />
        <el-button
          size="small"
          icon="Plus"
          @click="(handleArrayAdd(item.value, key), $emit('update:cfg', cfgData))"
          style="margin-left: 5px"
        ></el-button>
        <span>
          <el-tag
            v-for="(el, id) in item.value"
            :key="id"
            class="mx-1"
            closable
            @close="(cfgData[key].value.splice(id, 1), $emit('update:cfg', cfgData))"
            style="margin-left: 5px"
          >
            {{ el }}
          </el-tag>
        </span>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['cfg']);

const $emit = defineEmits(['update:cfg']);

const cfgData = ref();

watch(
  () => props.cfg,
  newValue => {
    cfgData.value = newValue;
  },
  { immediate: true, deep: true }
);

/**
 * 向数组添加值
 * @param value 值
 * @param key 键
 * @returns
 */
const handleArrayAdd = (value: any, key: string | number) => {
  if (value && Array.isArray(value)) {
    cfgData.value[key].value.push(cfgData.value[key].cur);
  } else {
    cfgData.value[key].value = [cfgData.value[key].cur];
  }
};
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
</style>
