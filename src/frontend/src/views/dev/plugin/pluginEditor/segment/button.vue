<template>
  <el-form>
    <el-form-item label="appid">
      <el-input class="seg-btn-appid" v-model="btnData.appid" placeholder="你的QQbot id"></el-input>
    </el-form-item>
    <!-- 按钮展示框 -->
    <el-form-item>
      <el-card class="seg-btn-content">
        <div
          class="seg-btn-coloum"
          v-for="(btnRow, btnRowId) in btnData.rows"
          :key="btnRowId"
          style="display: flex; justify-content: space-between"
        >
          <div class="seg-btn-row-box">
            <div class="seg-btn-row" v-for="(btn, btnId) in btnRow.buttons">
              <el-button
                :type="btn.render_data.style == 1 ? 'primary' : ''"
                :plain="btn.render_data.style == 1 ? true : false"
                size="small"
                @click="editBtn(btn, btnRowId as number, btnId as number)"
              >
                {{ btn.render_data.label }}
              </el-button>
            </div>
          </div>
          <div class="seg-btn-row-add">
            <el-button
              class="add-btn"
              icon="Plus"
              @click="addRowBtn(btnRowId as number)"
            ></el-button>
          </div>
        </div>
        <div class="seg-btn-coloum" style="display: flex; justify-content: space-between">
          <el-button icon="Plus" @click="addRow" style="margin-top: 3px"></el-button>
        </div>
      </el-card>
    </el-form-item>
  </el-form>

  <!-- 文件上传统一对话框 -->
  <el-dialog v-model="dialogFormVisible" title="按钮配置（重点配置星号）">
    <el-form>
      <el-form-item>
        <div class="sub-title">id</div>
        <el-input
          placeholder="按钮ID：在一个keyboard消息内设置唯一"
          v-model="curEditedBtn.value.id"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>render_data.label</div>
        <el-input
          v-model="curEditedBtn.value.render_data.label"
          placeholder="按钮上的文字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>render_data.visited_label</div>
        <el-input
          v-model="curEditedBtn.value.render_data.visited_label"
          placeholder="点击后按钮的上文字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>render_data.style（按钮样式）</div>
        <el-radio-group v-model="curEditedBtn.value.render_data.style">
          <el-radio :value="0">灰色线框</el-radio>
          <el-radio :value="1">蓝色线框</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>action.type</div>

        <el-radio-group v-model="curEditedBtn.value.action.type">
          <el-radio :value="0">跳转按钮：http 或 小程序 客户端识别 scheme</el-radio>
          <el-radio :value="1">回调按钮：回调后台接口, data 传给后台</el-radio>
          <el-radio :value="2">指令按钮：自动在输入框插入 @bot data</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>action.permission.type</div>
        <el-radio-group v-model="curEditedBtn.value.action.permission.type">
          <el-radio :value="0">指定用户可操作</el-radio>
          <el-radio :value="1">仅管理者可操作</el-radio>
          <el-radio :value="2">所有人可操作</el-radio>
          <el-radio :value="3">指定身份组可操作（仅频道可用）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="sub-title">action.permission.specify_user_ids（有权限的用户 id 的列表）</div>
        <div>
          <el-input v-model="curInputValue" size="small"></el-input>
          <el-button
            size="small"
            icon="Plus"
            @click="
              curEditedBtn.value.action.permission.specify_user_ids &&
              curEditedBtn.value.action.permission.specify_user_ids.push(curInputValue)
            "
            style="margin-left: 5px"
          ></el-button>
          <span>
            <el-tag
              v-for="(el, id) in curEditedBtn.value.action.permission.specify_user_ids"
              :key="id"
              class="mx-1"
              closable
              @close="
                curEditedBtn.value.action.permission.specify_user_ids &&
                curEditedBtn.value.action.permission.specify_user_ids.splice(id, 1)
              "
              style="margin-left: 5px"
            >
              {{ el }}
            </el-tag>
          </span>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>action.data</div>
        <el-input v-model="curEditedBtn.value.action.data" placeholder="操作相关的数据"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="sub-title">
          action.reply(指令按钮可用，指令是否带引用回复本消息，默认 false。支持版本 8983)
        </div>
        <el-switch
          v-model="curEditedBtn.value.action.reply"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66"
          active-text="Y"
          inactive-text="N"
        />
      </el-form-item>
      <el-form-item>
        <div class="sub-title">
          action.enter(指令按钮可用，点击按钮后直接自动发送 data，默认 false。支持版本 8983)
        </div>
        <el-switch
          v-model="curEditedBtn.value.action.enter"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66"
          active-text="Y"
          inactive-text="N"
        />
      </el-form-item>
      <el-form-item>
        <div class="sub-title">
          action.anchor(本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。 设置为 1 时
          ，点击按钮自动唤起启手Q选图器，其他值暂无效果。 仅支持手机端版本 8983+
          的单聊场景，桌面端不支持)
        </div>
        <el-input-number v-model="curEditedBtn.value.action.anchor" />
      </el-form-item>
      <el-form-item>
        <div class="sub-title">action.click_limit【已弃用】可操作点击的次数，默认不限</div>
        <el-input-number v-model="curEditedBtn.value.action.click_limit" />
      </el-form-item>
      <el-form-item>
        <div class="sub-title">
          action.at_bot_show_channel_list【已弃用】指令按钮可用，弹出子频道选择器，默认 false
        </div>
        <el-switch
          v-model="curEditedBtn.value.action.at_bot_show_channel_list"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66"
          active-text="Y"
          inactive-text="N"
        />
      </el-form-item>
      <el-form-item>
        <div class="sub-title"><span class="required">*</span>action.unsupport_tips</div>
        <el-input
          v-model="curEditedBtn.value.action.unsupport_tips"
          placeholder="客户端不支持本action的时候，弹出的toast文案"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="deleteBtn"> 删除 </el-button>
      <el-button
        type="primary"
        size="default"
        @click="((dialogFormVisible = false), $emit('update:btnContent', btnData))"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { buttonEl } from './default';
const props = defineProps(['btnContent']);

const $emit = defineEmits(['update:btnContent']);

// 按钮配置对话框
const dialogFormVisible = ref<boolean>(false);

// 临时存储数组输入值
const curInputValue = ref('');

const btnData = ref();

const curEditedBtn = reactive({
  row: 0,
  col: 0,
  value: buttonEl(),
});

const addRowBtn = (index: number) => {
  if (btnData.value.rows[index].buttons.length >= 10) {
    ElMessage.warning('超出最大列数限制！');
    return;
  }
  btnData.value.rows[index].buttons.push(buttonEl());
};

const addRow = () => {
  if (btnData.value.rows.length >= 10) {
    ElMessage.warning('超出最大行数限制！');
    return;
  }
  btnData.value.rows.push({
    buttons: [buttonEl()],
  });
};

const editBtn = (btn: any, btnRowId: number, btnId: number) => {
  // btnData.value.rows[index].buttons.push(buttonEl())
  // console.log(btn)
  dialogFormVisible.value = true;
  curEditedBtn.row = btnRowId;
  curEditedBtn.col = btnId;
  curEditedBtn.value = btn;
};

const deleteBtn = () => {
  dialogFormVisible.value = false;
  btnData.value.rows[curEditedBtn.row].buttons.splice(curEditedBtn.col, 1);
  if (btnData.value.rows[curEditedBtn.row].buttons.length == 0) {
    btnData.value.rows.splice(curEditedBtn.row, 1);
  }
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
.seg-btn-content.el-card {
  .el-card__body {
    padding: 5px;

    .el-button {
      width: 100%;
    }
  }
}

.seg-btn-content {
  margin-top: 15px;
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

        .el-button {
          // border: 2px solid red;
          width: 100% !important;
          padding-left: 2px;
          padding-right: 2px;
        }
      }
    }
  }
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
