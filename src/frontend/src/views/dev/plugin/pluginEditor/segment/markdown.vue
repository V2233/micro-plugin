<template>
  <el-form>
    <el-form-item label="custom_template_id">
      <el-input
        class="seg-markdown-appid"
        v-model="markdownData.custom_template_id"
        placeholder="模板id"
      ></el-input>
    </el-form-item>

    <!-- 按钮展示框 -->
    <el-form-item>
      <!-- <div class="sub-title" style="font-size: 18px; margin-top: 20px;">模板Markdown</div> -->
      <el-divider>模板Markdown</el-divider>
      <el-form>
        <el-form-item v-for="(param, index) in markdownData.params">
          <div class="sub-title">{{ param.key }}</div>
          <div style="display: flex; width: 100%; max-width: 100%">
            <el-input type="textarea" v-model="param.tempString" style="width: 100%"></el-input>
            <div style="width: 50px">
              <el-button
                icon="Plus"
                size="small"
                @click="
                  markdownData.params.splice(
                    (index as number) + 1,
                    0,
                    JSON.parse(JSON.stringify(param))
                  )
                "
                style="margin-left: 5px"
              ></el-button>
              <el-button
                size="small"
                icon="Delete"
                style="margin-left: 5px"
                @click="markdownData.params.splice(index, 1)"
              ></el-button>
            </div>
            <div style="width: 50px">
              <el-button
                icon="ArrowUpBold"
                size="small"
                @click="
                  [markdownData.params[(index as number) - 1], markdownData.params[index]] = [
                    markdownData.params[index],
                    markdownData.params[(index as number) - 1],
                  ]
                "
                style="margin-left: 5px"
              ></el-button>
              <el-button
                size="small"
                icon="ArrowDownBold"
                @click="
                  [markdownData.params[index], markdownData.params[(index as number) + 1]] = [
                    markdownData.params[(index as number) + 1],
                    markdownData.params[index],
                  ]
                "
                style="margin-left: 5px"
              ></el-button>
            </div>
          </div>
          <div>
            <el-button
              icon="Plus"
              size="small"
              @click="markdownData.params[index].values.push(param.tempString)"
              style="margin-left: 5px"
            ></el-button>
            <div>
              <el-tag
                v-for="(el, id) in param.values"
                :key="id"
                class="mx-1"
                closable
                @close="param.values.splice(id, 1)"
                style="margin-left: 5px; text-overflow: ellipsis"
              >
                {{ el }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-form-item>
  </el-form>
  <el-divider>原生Markdown(填了优先使用)</el-divider>
  <Editor :code="mdContent.content" ext="md" :isImmediate="true" @getCode="saveCode" />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import Editor from '../../../fs/codeEditor.vue';

const props = defineProps(['mdContent']);

const $emit = defineEmits(['update:mdContent']);

const markdownData = ref();

/**
 * 保存编辑器markdown
 * @param code
 */
const saveCode = (code: string) => {
  // console.log(code)
  markdownData.value.content = code;
  ElMessage.success('原生markdown保存成功，可点击页面保存添加到指令！');
};

watch(
  () => props.mdContent,
  newValue => {
    markdownData.value = newValue;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
.seg-markdown-content.el-card {
  .el-card__body {
    padding: 5px;
  }
}

.seg-markdown-content {
  margin-top: 15px;
  width: 100%;
  border-radius: 5px;
}

.el-tag {
  height: auto;
  padding: 5px 5px;
  white-space: wrap;
  word-break: break-all;
  word-wrap: break-word;
  text-overflow: ellipsis;
}

.sub-title {
  position: relative;
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  align-items: center;
  margin-top: 5px;

  .required {
    color: red;
  }
}
</style>
