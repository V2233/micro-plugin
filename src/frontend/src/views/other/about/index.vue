<template>
  <div class="about-container">
    <el-card>
      <!-- 系统信息展示框 -->
      <div class="system-info-box">
        <div class="system-info-content">
          <div class="system-info-left">
            <img src="/terminal.png" alt="Logo" class="system-info-logo" />
          </div>
          <div class="system-info-right">
            <h1 class="system-info-title">Yunzai Dev</h1>
            <p class="system-info-subtitle">低代码开发管理平台</p>
          </div>
        </div>
      </div>

      <!-- 折叠面板 -->
      <el-collapse class="about-collapse">
        <!-- 开源地址折叠项 -->
        <el-collapse-item title="开源地址" name="1">
          <div class="open-source-item">
            <div class="open-source-name">Micro Plugin</div>
            <div class="open-source-actions">
              <a :href="githubUrl" target="_blank" class="open-source-link">{{ githubUrl }}</a>
              <el-button type="primary" @click="openGithub">跳转</el-button>
            </div>
          </div>
        </el-collapse-item>

        <!-- 贡献者名单折叠项 -->
        <el-collapse-item title="贡献者名单" name="2">
          <div class="card_box">
            <personal-card
              v-for="(c, index) in contributors"
              :key="index"
              :author="c.author"
              :avatar="c.avatar"
              :content="c.content"
              :qq="c.qq"
              :github="c.github"
              :gitee="c.gitee"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import PersonalCard from './card.vue';
import contributors from '@/contributors';

// 开源地址
const githubUrl = 'https://github.com/V2233/micro-plugin';

// 打开GitHub链接
const openGithub = () => {
  window.open(githubUrl, '_blank');
};
</script>

<style scoped lang="scss">
// .about-container {
//     width: 100%;
//     padding: 20px;
// }

/* 系统信息展示框 */
.system-info-box {
  background: transparent;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
}

.system-info-content {
  display: flex;
  align-items: center;
}

.system-info-left {
  margin-right: 20px;
}

.system-info-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.system-info-right {
  display: flex;
  flex-direction: column;
}

.system-info-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  padding: 0;
  color: inherit;
}

.system-info-subtitle {
  font-size: 14px;
  color: inherit;
  margin: 5px 0 0 0;
  opacity: 0.8;
}

/* 折叠面板样式 */
.about-collapse {
  margin-bottom: 20px;
}

/* 开源地址样式 */
.open-source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.open-source-name {
  font-size: 16px;
  font-weight: bold;
}

.open-source-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.open-source-link {
  color: #409eff;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.open-source-link:hover {
  text-decoration: underline;
}

/* 贡献者名单样式 */
.card_box {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  min-height: 320px;
}

@media (orientation: portrait) {
  .card_box {
    justify-content: center;
  }
}
</style>
