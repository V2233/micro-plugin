<template>
  <div class="card-box">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card-box {
  width: calc(100% - 20px);
  height: auto;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  background-color: #ffffff;
}
</style>
