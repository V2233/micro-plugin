<template>
  <div
    class="js-warp-hide bg-gray-dark-mktg d-flex flex-auto flex-column overflow-hidden position-relative"
    style="width: 100vw; height: 100vh; overflow: hidden"
  >
    <div class="sky-space">
      <div class="sky-stars"></div>
      <div class="sky-stars"></div>
      <div class="sky-stars"></div>
      <div class="sky-stars"></div>
      <div class="sky-stars"></div>
      <div class="sky-stars"></div>
    </div>
    <div class="sky-space-bg">
      <div class="sky-bg-stars"></div>
      <div class="sky-bg-stars"></div>
      <div class="sky-bg-stars"></div>
      <div class="sky-bg-stars"></div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.bg-gray-dark-mktg {
  background-image: radial-gradient(#04255b, #020a1d);
}
.d-flex {
  display: flex !important;
}
.overflow-hidden {
  overflow: hidden !important;
}
.position-relative {
  position: relative !important;
}
.flex-auto {
  flex: auto !important;
}
.flex-column {
  flex-direction: column !important;
}
.sky-space-bg {
  position: absolute;
  top: 36vh;
  left: 42vw;
  height: 16vw;
  width: 16vw;
}
.sky-bg-stars {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-image:
    radial-gradient(1px 2px at 50px 50px, #eee, rgba(0, 0, 0, 0)),
    radial-gradient(2px 3px at 20px 35px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(3px 3px at 60px 20px, #ddd, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.2;
  animation: opacity 8s infinite;
}
.sky-bg-stars:nth-child(1) {
  background-position: 0% 90%;
  animation-delay: 0s;
}
.sky-bg-stars:nth-child(2) {
  background-position: 50% 10%;
  animation-delay: 0.6s;
}
.sky-bg-stars:nth-child(3) {
  background-position: 40% -80%;
  background-size: 120px 200px;
  animation-delay: 1.8s;
}
.sky-bg-stars:nth-child(4) {
  background-position: 150% -80%;
  background-size: 220px 100px;
  animation-delay: 3.2s;
}
.sky-space,
.sky-stars {
  position: absolute;
  top: 0;
  right: 5vw;
  bottom: 0;
  left: 5vw;
  overflow: hidden;
}
.sky-stars {
  background-image:
    radial-gradient(2px 2px at 50px 200px, #eee, rgba(0, 0, 0, 0)),
    radial-gradient(3px 3px at 40px 60px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(4px 5px at 100px 30px, #ddd, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 380px 380px;
  opacity: 0;
  animation-name: zoom;
  animation-delay: 0s;
  animation-duration: 10s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
}
.sky-stars:nth-child(1) {
  /* background-image:radial-gradient(
          2px 2px at 50px 200px,#fff
        ),radial-gradient(2px 3px at 40px 70px,#fff),radial-gradient(3px 4px at 120px 40px,#fff);
	*/
  top: 20vh;
  bottom: 20vh;
  left: 10vw;
  right: 10vw;
  background-size: 120px 120px;
  background-position: 10% 90%;
}
.sky-stars:nth-child(2) {
  background-position: 20% 50%;
  animation-delay: 0.3s;
}
.sky-stars:nth-child(3) {
  background-position: 40% 20%;
  animation-delay: 1.3s;
}
.sky-stars:nth-child(4) {
  background-position: 50% 10%;
  background-size: 200px 200px;
  transform: rotate(60deg);
  animation-delay: 2.1s;
}
.sky-stars:nth-child(5) {
  background-position: 30% 30%;
  background-size: 120px 270px;
  animation-delay: 3s;
}
.sky-stars:nth-child(6) {
  background-position: 50% 20%;
  animation-delay: 5.5s;
}
@keyframes opacity {
  0% {
    opacity: 0.2;
    transform: rotate(-5deg);
    animation-timing-function: ease-in;
  }
  50% {
    opacity: 0.8;
    transform: rotate(-13deg);
    animation-timing-function: ease-in;
  }
  100% {
    opacity: 0.1;
    transform: rotate(-20deg);
    animation-timing-function: ease-in;
  }
}
@keyframes zoom {
  0% {
    opacity: 0.02;
    transform: scale(0.1);
    transform: rotate(-20deg);
    animation-timing-function: ease-in;
  }
  5% {
    opacity: 0.05;
    /* transform:scale(0.3);
        */
  }
  50% {
    opacity: 0.6;
    /* transform:scale(1.2);
        */
  }
  75% {
    opacity: 0.3;
    transform: scale(1.8);
    /* transform:rotate(2deg);
        */
  }
  100% {
    opacity: 0.1;
    transform: scale(2.2);
  }
}
</style>
