<template>
  <div v-if="store.current.style">
    <el-row :gutter="10">
      <el-col :span="10">开启阴影:</el-col>
      <el-col :span="14">
        <div style="display: flex; justify-content: flex-end">
          <el-switch v-model="shadow" size="small" @change="handleSwitchShadow" />
        </div>
      </el-col>
    </el-row>

    <template v-if="shadow">
      <el-row :gutter="10">
        <el-col :span="10">水平阴影:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="shadowX"
            :step="1"
            :min="-10"
            :max="10"
            size="small"
            @input="onChange"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">垂直阴影:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="shadowY"
            :step="1"
            :min="-10"
            :max="10"
            size="small"
            @input="onChange"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">模糊距离:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="shadowBlur"
            :step="1"
            :min="1"
            :max="20"
            size="small"
            @input="onChange"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">阴影颜色:</el-col>
        <el-col :span="14">
          <ColorPicker v-model="shadowColor" @change="onChange" />
        </el-col>
      </el-row>
    </template>

    <el-divider />

    <el-row :gutter="10">
      <el-col :span="10">新拟态风格:</el-col>
      <el-col :span="14">
        <div style="display: flex; justify-content: flex-end">
          <el-switch v-model="neumor" size="small" @change="handleSwitchShadow" />
        </div>
      </el-col>
    </el-row>

    <template v-if="neumor">
      <div
        class="light-box"
        :style="{
          background: (store.current.style?.background ||
            store.current.style?.backgroundColor) as string,
        }"
      >
        <LightSource
          :top="'0'"
          :bottom="'unset'"
          :right="'0'"
          :left="'unset'"
          :active="activeLight == 2"
          data-value="2"
          @click="setLightSource(2)"
          class="light-source"
        />
        <LightSource
          :top="'0'"
          :bottom="'unset'"
          :right="'unset'"
          :left="'0'"
          :active="activeLight == 1"
          data-value="1"
          @click="setLightSource(1)"
          class="light-source"
        />
        <LightSource
          :top="'unset'"
          :bottom="'0'"
          :right="'0'"
          :left="'unset'"
          :active="activeLight == 3"
          data-value="3"
          @click="setLightSource(3)"
          class="light-source"
        />
        <LightSource
          :top="'unset'"
          :bottom="'0'"
          :right="'unset'"
          :left="'0'"
          :active="activeLight == 4"
          data-value="4"
          @click="setLightSource(4)"
          class="light-source"
        />
        <div
          class="soft-element soft-shadow"
          :style="{ ...store.current.style, borderRadius: store.current.style.borderRadius + 'px' }"
        ></div>
      </div>

      <el-row :gutter="10">
        <el-col :span="10">圆角:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="store.current.style.borderRadius"
            :step="1"
            :min="0"
            :max="(store.current.width as number) / 2"
            size="small"
            @input="onChange('neumorDistance')"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">模糊距离:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="neumorDistance"
            :step="1"
            :min="5"
            :max="50"
            size="small"
            @input="onChange('neumorDistance')"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">强度:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="neumorIntensity"
            :step="0.01"
            :min="0"
            :max="1"
            size="small"
            @input="onChange"
          />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">模糊大小:</el-col>
        <el-col :span="14">
          <el-slider
            v-model="neumorBlur"
            :step="1"
            :min="0"
            :max="100"
            size="small"
            @input="onChange"
          />
        </el-col>
      </el-row>

      <ShapeSwitcher
        :shape="shape"
        :setShape="handleShape"
        :stroke="
          (store.current.style?.background || store.current.style?.backgroundColor) as string
        "
      />
    </template>
    <el-divider />
  </div>
</template>

<script setup lang="ts">
import ColorPicker from './ColorPicker.vue';
import ShapeSwitcher from './ShapeSwitcher.vue';
import LightSource from './LightSource.vue';
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '../../../store';
import { colorLuminance, isValidColor, getContrast } from './utils';
const store = useEditorStore();
const shadow = ref(false);
const neumor = ref(false);
const shadowX = ref(3);
const shadowY = ref(3);
const positionX = ref(3);
const positionY = ref(3);
const shadowBlur = ref(1);
const shadowColor = ref('#808080');

const neumorBlur = ref(0);
const neumorDistance = ref(0);
const neumorIntensity = ref(0.15);

const shape = ref(0);
const angle = ref(145);
const gradient = ref(false);
const activeLight = ref(1);

const boxShadow = computed(() => {
  if (neumor.value) {
    const darkColor = colorLuminance(
      (store.current.style?.background || store.current.style?.backgroundColor) as string,
      neumorIntensity.value * -1
    );
    const lightColor = colorLuminance(
      (store.current.style?.background || store.current.style?.backgroundColor) as string,
      neumorIntensity.value
    );
    const boxShadowPosition = shape.value === 1 ? 'inset' : '';
    switch (angle.value) {
      case 145:
        positionX.value = neumorDistance.value;
        positionY.value = neumorDistance.value;
        break;
      case 225:
        positionX.value = neumorDistance.value * -1;
        positionY.value = neumorDistance.value;
        break;
      case 315:
        positionX.value = neumorDistance.value * -1;
        positionY.value = neumorDistance.value * -1;
        break;
      case 45:
        positionX.value = neumorDistance.value;
        positionY.value = neumorDistance.value * -1;
        break;
      default:
        positionX.value = neumorDistance.value;
        positionY.value = neumorDistance.value;
        break;
    }

    return `${boxShadowPosition} ${positionX.value}px ${positionY.value}px ${neumorBlur.value}px ${darkColor}, ${boxShadowPosition} ${positionX.value * -1}px ${positionY.value * -1}px ${neumorBlur.value}px ${lightColor}`;
  } else {
    return `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowColor.value}`;
  }
});

const setLightSource = (source: number) => {
  activeLight.value = source;
  switch (source) {
    case 1:
      angle.value = 145;
      break;
    case 2:
      angle.value = 225;
      break;
    case 3:
      angle.value = 315;
      break;
    case 4:
      angle.value = 45;
      break;
    default:
      angle.value = 145;
      break;
  }
  store.current.style!.boxShadow = boxShadow.value;
  // console.log(angle.value)
};

const handleShape = (shapeValue: string) => {
  console.log(shapeValue);
  const shapeId = parseInt(shapeValue);
  shape.value = shapeId;
  if (shapeId === 2 || shapeId === 3) {
    gradient.value = true;
  } else {
    gradient.value = false;
  }

  const color =
    ((store.current.style?.background || store.current.style?.backgroundColor) as string) ||
    '#000000';
  if (!isValidColor(color)) {
    return;
  }
  const firstGradientColor =
    gradient.value && shape.value !== 1
      ? colorLuminance(color, shape.value === 3 ? 0.07 : -0.1)
      : color;
  const secondGradientColor =
    gradient.value && shape.value !== 1
      ? colorLuminance(color, shape.value === 2 ? 0.07 : -0.1)
      : color;

  const background =
    gradient.value && shape.value !== 1
      ? `linear-gradient(${angle.value}deg, ${firstGradientColor}, ${secondGradientColor})`
      : `${color}`;
  store.current.style!.background = background;
  store.current.style!.boxShadow = boxShadow.value;
};

const handleSwitchShadow = (e: boolean) => {
  if (e) {
    store.current.style!.boxShadow = boxShadow.value;
  } else {
    store.current.style!.boxShadow = undefined;
  }
};

function onChange(name?: string) {
  if (name && name == 'neumorDistance') {
    neumorBlur.value = neumorDistance.value * 2;
  }
  store.current.style!.boxShadow = boxShadow.value;
}

// watch(shadow, (val) => {
//   if (val) {
//     store.current.style!.boxShadow = boxShadow.value
//   } else {
//     store.current.style!.boxShadow = undefined
//   }
// })
</script>

<style scoped lang="scss">
.light-box {
  width: 100%;
  height: 120px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  // border: 2px solid red;
}
.soft-element {
  width: 80px;
  height: 80px;
}
</style>
