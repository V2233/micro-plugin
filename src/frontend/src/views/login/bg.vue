<template>
  <div class="card">
    <div class="main">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.card {
  position: relative;
  width: 190px;
  height: 254px;
  background-color: #000;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: end;
  padding: 12px;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  // border: 2px solid red;
}

.main {
  z-index: 60;
  position: relative;
  width: 100%;
  height: 100%;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  left: -5px;
  margin: auto;
  width: 200px;
  height: 264px;
  display: block;
  border-radius: 10px;
  background: linear-gradient(-45deg, #24ff1c 0%, #40c9ff 100%);
  background-size: 80% 80%;
  z-index: -100;
  pointer-events: none;
  -webkit-transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card::after {
  content: '';
  z-index: -1;
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, #00ff2a 0%, #00dbde 100%);
  -webkit-transform: translate3d(0, 0, 0) scale(0.95);
  transform: translate3d(0, 0, 0) scale(0.95);
  -webkit-filter: blur(20px);
  filter: blur(20px);
}

.heading {
  font-size: 20px;
  text-transform: capitalize;
  font-weight: 700;
  z-index: 5;
}

.card p:not(.heading) {
  font-size: 14px;
}

.card:hover::after {
  -webkit-filter: blur(30px);
  filter: blur(30px);
}

.card:hover::before {
  background: linear-gradient(-45deg, #24ff1c 0%, #40c9ff 100%);
  -webkit-transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  -ms-transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  transform: rotate(-90deg) scaleX(1.34) scaleY(0.77);
  z-index: -100;
}

// .card:hover {
//     transform: scale(1);
// }

@media (orientation: landscape) {
  .card {
    width: 380px;
  }

  .card::before {
    width: 390px;
  }

  .card::after {
    width: 390px;
  }

  .card:hover::before {
    -webkit-transform: rotate(-90deg) scaleX(0.67) scaleY(1.48);
    -ms-transform: rotate(-90deg) scaleX(0.67) scaleY(1.48);
    transform: rotate(-90deg) scaleX(0.67) scaleY(1.48);
  }
}
</style>
