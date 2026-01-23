<template>
  <div>
    <!-- <div class="row row--label">
        <label>剖面: </label>
      </div> -->
    <div class="row">
      <div class="shape-switch">
        <el-button
          :class="{ active: shape === 0 }"
          @click="setShape(0)"
          name="flat"
          title="Flat"
          data-shape="0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="145"
            height="24"
            viewBox="0 0 145 24"
            fill="none"
            :stroke="stroke"
          >
            <path
              d="M0 22H7C15.2843 22 22 15.2843 22 7.00001V3C22 2.44772 22.4477 2 23 2H121C121.552 2 122 2.44772 122 3V7.00001C122 15.2843 128.716 22 137 22H145"
              stroke="inherit"
              stroke-width="6"
            />
          </svg>
        </el-button>
        <el-button
          :class="{ active: shape === 2 }"
          @click="setShape(2)"
          name="concave"
          title="Concave"
          data-shape="2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="145"
            height="24"
            viewBox="0 0 145 24"
            fill="none"
            :stroke="stroke"
          >
            <path
              d="M0 22H7C15.2843 22 22 15.2843 22 7.00001V3.39336C22 2.7091 22.6808 2.2299 23.3304 2.44485C59.2066 14.3156 85.7767 12.9047 120.7 2.39438C121.343 2.20072 122 2.67921 122 3.3512V7.00001C122 15.2843 128.716 22 137 22H145"
              stroke="inherit"
              stroke-width="6"
            />
          </svg>
        </el-button>
        <el-button
          :class="{ active: shape === 3 }"
          @click="setShape(3)"
          name="convex"
          title="Convex"
          data-shape="3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="145"
            height="33"
            viewBox="0 0 145 33"
            fill="none"
            :stroke="stroke"
          >
            <path
              d="M0 31H7C15.2843 31 22 24.2843 22 16V11.7329C22 11.2966 22.2898 10.9083 22.7061 10.7779C60.0722 -0.924818 84.913 -0.925978 121.302 10.7745C121.714 10.9071 122 11.2935 122 11.727V16C122 24.2843 128.716 31 137 31H145"
              stroke="inherit"
              stroke-width="6"
            />
          </svg>
        </el-button>
        <el-button
          :class="{ active: shape === 1 }"
          @click="setShape(1)"
          name="pressed"
          title="Pressed"
          data-shape="1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="145"
            height="24"
            viewBox="0 0 145 24"
            fill="none"
            :stroke="stroke"
          >
            <path
              d="M0 2H22V21C22 21.5523 22.4477 22 23 22H121C121.552 22 122 21.5523 122 21V2H145"
              stroke="inherit"
              stroke-width="6"
            />
          </svg>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  shape: {
    type: Number,
    required: true,
  },
  setShape: {
    type: Function,
    required: true,
  },
  stroke: {
    type: String,
    default: '#409EFF',
  },
});

// const { shape, setShape } = toRefs(props)
</script>

<style scoped>
.shape-switch {
  display: flex;
  overflow: hidden;
  border-radius: 3px;
  flex-grow: 1;

  .el-button {
    /* border: 2px solid red; */
    flex-grow: 1;
    padding: 0px 2px;
    /* background:#001f3f; */
    color: #f6f5f7;
    cursor: pointer;
    outline: 0;
    /* border: none; */
    opacity: 0.8;

    svg {
      width: 45px;
    }

    /* * {
            pointer-events: none;
        } */

    .active {
      opacity: 1;
    }
  }
}
</style>
