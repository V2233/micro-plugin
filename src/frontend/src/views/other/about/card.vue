<template>
  <div class="main">
    <div class="card">
      <div class="card_content">
        <label class="switch_738">
          <input type="checkbox" class="chk_738" />
          {{ content }}
        </label>
      </div>
    </div>
    <div class="card_back"></div>
    <div class="data">
      <div class="img">
        <img :src="avatar" style="width: 100%; height: 100%" />
      </div>
      <div class="text">
        <div class="text_m">{{ author }}</div>
      </div>
    </div>
    <div class="btns">
      <div class="likes" v-if="github">
        <a :href="github" target="_blank">
          <svg
            t="1720796346257"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4241"
            width="20"
            height="20"
          >
            <path
              d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
              fill="white"
              p-id="4242"
            ></path>
          </svg>
        </a>
      </div>

      <div class="comments" v-if="gitee">
        <a :href="gitee" target="_blank">
          <svg
            t="1720797592466"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5544"
            id="mx_n_1720797592467"
            width="18"
            height="18"
          >
            <path
              d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.296 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84h-240.224a25.28 25.28 0 0 1-25.28-25.28v-240.192a75.84 75.84 0 0 1 75.84-75.84h353.92a25.28 25.28 0 0 0 25.28-25.28l0.064-63.2a25.312 25.312 0 0 0-25.28-25.312H417.184a189.632 189.632 0 0 0-189.632 189.6v353.952c0 13.952 11.328 25.28 25.28 25.28h372.928a170.656 170.656 0 0 0 170.656-170.656v-145.376a25.28 25.28 0 0 0-25.28-25.28z"
              p-id="5545"
              fill="#ffffff"
            ></path>
          </svg>
        </a>
      </div>

      <div class="views" v-if="qq">
        <a :href="qq" target="_blank">
          <svg
            t="1720800651016"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6767"
            width="20"
            height="20"
          >
            <path
              d="M871.2 584.2c-14.2-33.9-33.1-64-52.6-86.8 7.6-11.3 12.3-27.2 12.3-44.9 0-23.8-8.6-44.5-21.2-55 2.6-15.3 4-31 4-47 0-157.9-131.6-285.9-294-285.9-162.3 0-293.9 128-293.9 285.9 0 9.2 0.5 18.2 1.3 27.2-13.2 10.1-22.3 31.3-22.3 55.8 0 20.9 6.7 39.4 16.8 50.7-21.5 20.9-42.9 49.3-60 82.7-41.7 81.4-35.5 163.7-9.8 177.1 13.2 6.9 47.5-14.7 81.2-54.8 5.5 47.1 28.2 90.2 63.1 124.8-57.7 16.7-95.9 49.7-90.8 83.2 6.4 42.3 79.4 69.5 163.2 60.6 61.3-6.5 111.4-30.5 131.3-59.5 5.1 0.2 10.3 0.4 15.5 0.4 9 0 17.8-0.4 26.6-1 21.3 27.6 68.4 50.6 125.3 57.7 81.3 10.1 151.6-15.9 157-58.1 4.3-33.3-32.9-66.7-88.5-84.4 32.7-32.9 54.5-73.3 61.1-117.5 29.9 40.1 60.6 65.8 76.6 62.3 18.9-4.1 32.4-90.6-2.2-173.5z"
              fill="#ffffff"
              p-id="6768"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// defineProps(['avatar', 'author', 'content', 'contact'])
defineProps({
  avatar: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  qq: { type: String, default: '' },
  github: { type: String, default: '' },
  gitee: { type: String, default: '' },
});
</script>

<style scoped>
.main {
  position: relative;
  margin: 16px;
  /* border: 2px solid blue; */
  min-height: 15em;
  display: flex;
  flex-direction: column;
}

.card {
  width: 18em;
  height: 12em;
  background-color: #252525;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.card_back {
  position: absolute;
  width: 18em;
  height: 12em;
  top: 20px;
  left: 10px;
  background-color: rgba(30, 31, 38, 0.575);
  border-radius: 7px;
  transition: 0.2s ease-in-out;
  z-index: -1;
}

.main:hover .card_back {
  width: 19.5em;
  top: -10px;
  left: -10px;
  height: 14em;
  cursor: pointer;
}

.main:hover .fl {
  opacity: 1;
  cursor: pointer;
  margin-right: 0.5em;
}

.data {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
}

.img {
  width: 2.25em;
  height: 2.25em;
  background-color: #252525;
  border-radius: 5px;
  overflow: hidden;
}

.text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 0.5em;
  font-family: Montserrat;
  color: white !important;
}

.text_m {
  font-weight: bold;
  font-size: 0.9em;
}

.text_s {
  font-size: 0.7em;
}

.btns {
  display: flex;
  gap: 0.5em;
  transition: 0.2s ease-in-out;
  padding: 0.5em 0;
  min-height: 3em;
}

.likes {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.916em;
  height: 1.944em;
  border-radius: 6px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: 0.2s ease-in-out;
}

.likes_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.likes_svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.likes:hover {
  background-color: #5a5f73;
  cursor: pointer;
}

.comments {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.916em;
  height: 1.944em;
  border-radius: 6px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: 0.24s ease-in-out;
}

.comments_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.comments_svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.comments:hover {
  background-color: #5a5f73;
  cursor: pointer;
}

.views {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.916em;
  height: 1.944em;
  border-radius: 6px;
  margin-top: -0.5em;
  opacity: 0;
  background-color: #444857;
  transition: 0.28s ease-in-out;
}

.views_text {
  font-family: Montserrat;
  font-size: 0.8em;
  margin-left: 0.25em;
  color: white;
}

.views_svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.views:hover {
  background-color: #5a5f73;
  cursor: pointer;
}

.main:hover .likes {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .comments {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .views {
  margin-top: 0.5em;
  opacity: 1;
}

/* The Main Switch */

.card_content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 10px;
  /* margin-top: -15px; */
  line-height: 1.2rem;
}

/* The switch - the box around the slider */
.switch_738 {
  font-size: 13px;
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  color: white !important;
}

/* Hide default HTML checkbox */
.switch_738 .chk_738 {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider_738 {
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 2em;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 5px;
}

.slider_738:before {
  position: absolute;
  content: '';
  height: 1em;
  width: 2em;
  border-radius: 5px;
  left: 0.5em;
  top: 0.5em;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: 0.4s;
}

.slider_738:after {
  background:
    linear-gradient(transparent 50%, rgba(255, 255, 255, 0.15) 0) 0 50% / 50% 100%,
    repeating-linear-gradient(
        90deg,
        rgb(255, 255, 255) 0,
        rgb(255, 255, 255),
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 40%
      )
      0 50% / 50% 100%,
    radial-gradient(circle at 50% 50%, rgb(255, 255, 255) 25%, transparent 26%);
  background-repeat: no-repeat;
  border: 0.25em solid transparent;
  border-left: 0.4em solid #ffffff;
  border-right: 0 solid transparent;
  transition:
    border-left-color 0.1s 0.3s ease-out,
    transform 0.3s ease-out;
  transform: translateX(-22.5%) rotate(90deg);
  transform-origin: 25% 50%;
  position: relative;
  top: 0.75em;
  left: 1.25em;
  width: 1.5em;
  height: 0.75em;
  box-sizing: border-box;
}

.chk_738:checked + .slider_738 {
  background-color: limegreen;
}

.chk_738:focus + .slider_738 {
  box-shadow: 0 0 1px limegreen;
}

.chk_738:checked + .slider_738:before {
  transform: translateX(12em);
}

.chk_738:checked + .slider_738:after {
  transform: rotateZ(90deg) rotateY(180deg) translateY(0.45em) translateX(-1.4em);
}
/* 暗黑模式下文字保持白色 */
.dark {
  .text {
    color: white !important;
  }
}
</style>
