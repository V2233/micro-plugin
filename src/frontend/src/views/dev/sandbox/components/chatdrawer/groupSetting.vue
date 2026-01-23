<template>
  <div v-if="chat_type == 'group'">
    <QQCard>
      <div class="introduction" @click="$emit('setName', { type: 'group_info', data: curGroup })">
        <img
          class="introduction-avatar"
          :src="`https://p.qlogo.cn/gh/${(curGroup as groupInfoType)?.group_id}/${(curGroup as groupInfoType)?.group_id}/640`"
        />
        <div class="introduction-content">
          <div class="introduction-content-left">
            <span style="font-size: 14px">{{ (curGroup as groupInfoType)?.group_name }}</span>
          </div>
          <div class="introduction-content-right">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </QQCard>
    <QQCard>
      <div class="group-members">
        <div class="group-members-title">
          <span>群聊成员</span>
          <span class="card-desc"
            >查看{{ (curGroup as groupInfoType)?.member_list?.length }}名群成员</span
          >
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="group-members-list">
          <div
            class="group-members-item"
            v-for="(member, memberId) in (curGroup as groupInfoType)?.member_list"
            :key="memberId"
            @click="$emit('setName', { type: 'member_info', data: member })"
          >
            <img
              class="group-members-item-avatar"
              :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${member.user_id}`"
            />
            <div class="group-members-item-nickname">
              {{ member.card ? member.card : member.nickname }}
            </div>
          </div>
          <div class="group-members-item">
            <div
              class="group-members-item-avatar"
              @click="$emit('setName', { type: 'group_member_invite', data: {} })"
            >
              <el-icon><Plus /></el-icon>
            </div>
            <div class="group-members-item-nickname">邀请</div>
          </div>
          <div class="group-members-item">
            <div
              class="group-members-item-avatar"
              @click="$emit('setName', { type: 'group_member_decrease', data: {} })"
            >
              <el-icon><Minus /></el-icon>
            </div>
            <div class="group-members-item-nickname">移除</div>
          </div>
        </div>
      </div>
    </QQCard>
    <div class="card-title">群聊信息</div>
    <QQCard>
      <div
        class="card-list-item"
        @click="
          $emit('setName', { type: 'group_name', data: (curGroup as groupInfoType)?.group_name })
        "
      >
        <span>群聊名称</span>
        <span class="card-desc">{{ (curGroup as groupInfoType)?.group_name }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="card-list-divider"></div>
      <div class="card-list-item">
        <span>群号</span>
        <span
          class="card-desc"
          :style="{
            backgroundColor: ' #F5F5F5',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }"
        >
          <el-icon style="margin-right: 3px"><Lock /></el-icon
          >{{ (curGroup as groupInfoType)?.group_id }}
        </span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="card-list-divider"></div>
      <div
        class="card-list-item"
        @click="
          $emit('setName', {
            type: 'self_card',
            data: (curGroup as groupInfoType)?.member_list?.find(
              (member: any) => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id
            )?.card,
          })
        "
      >
        <span>我的本群昵称</span>
        <span class="card-desc">{{
          (curGroup as groupInfoType)?.member_list?.find(
            (member: any) => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id
          )?.card
        }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </QQCard>
    <div class="card-title">群聊会话</div>
    <QQCard>
      <div
        class="card-list-item"
        @click="$emit('setName', { type: 'search_chat_records', data: '' })"
      >
        <span>查找聊天记录</span>
        <span class="card-desc">图片、视频、文件等</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="card-list-divider"></div>
      <div class="card-list-item">
        <span>设为置顶</span>
        <span class="card-desc">
          <el-switch v-model="isTop" class="ml-2" size="small" />
        </span>
      </div>
    </QQCard>
    <QQCard>
      <div
        class="dismiss-group"
        v-if="role == 'owner'"
        @click="$emit('setName', { type: 'dismiss_group', data: '' })"
      >
        解散群聊
      </div>
      <div
        class="dismiss-group"
        v-if="
          role !== 'owner' &&
          (curGroup as groupInfoType).member_list?.some(
            member => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id
          )
        "
        @click="$emit('setName', { type: 'exit_group', data: '' })"
      >
        退出群聊
      </div>
      <div
        class="dismiss-group"
        v-if="
          !(curGroup as groupInfoType).member_list?.some(
            member => member.user_id == devStore[devStore.curAdapter].cur_self_info.user_id
          )
        "
        @click="$emit('setName', { type: 'join_group', data: '' })"
      >
        申请加群
      </div>
    </QQCard>
  </div>
  <div v-if="chat_type == 'private'">
    <QQCard>
      <div
        class="introduction"
        style="height: 50px; padding-bottom: 10px"
        @click="$emit('setName', { type: 'friend_info', data: curPrivate })"
      >
        <img
          class="introduction-avatar"
          :src="`https://q1.qlogo.cn/g?b=qq&s=0&nk=${(curPrivate as friendInfoType).user_id}`"
        />
        <div class="introduction-content">
          <div class="introduction-content-left">
            <span style="font-size: 14px">{{ (curPrivate as friendInfoType).nickname }}</span>
          </div>
          <div class="introduction-content-right">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <div class="card-list-divider"></div>
      <div
        class="introduction"
        style="height: 50px; padding-top: 10px"
        @click="$emit('setName', { type: 'create_group_from_friend', data: '' })"
      >
        <div
          class="introduction-avatar"
          style="
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            background-color: #e8e8e8;
          "
        >
          <el-icon size="20" color="#7F7F7F"><Plus /></el-icon>
        </div>
        <div class="introduction-content">
          <div class="introduction-content-left">
            <span style="font-size: 14px">发起群聊</span>
          </div>
          <div class="introduction-content-right">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </QQCard>
    <QQCard>
      <div
        class="card-list-item"
        @click="$emit('setName', { type: 'search_chat_records', data: '' })"
      >
        <span>查找聊天记录</span>
        <span class="card-desc">图片、视频、文件等</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </QQCard>
    <QQCard>
      <div
        class="dismiss-group"
        @click="
          $emit('setName', { type: 'delete_friend', data: (curPrivate as friendInfoType).user_id })
        "
      >
        删除好友
      </div>
    </QQCard>
  </div>
</template>

<script setup lang="ts">
import type { groupInfoType, friendInfoType } from '../../protocol/onebotv11/api/type';
import QQCard from '../qqcard.vue';
import { computed, ref } from 'vue';
import useDevStore from '@/store/modules/dev';

const $emit = defineEmits(['setName']);

const devStore = useDevStore();

const isTop = ref(false);

const props = defineProps({
  /** 当前会话场景，'group','private','guild' */
  chat_type: { type: String, default: 'group' },
  group_size: { type: Number, default: 11 },
  group_id: { type: Number, default: 114514 },
  nickname: { type: String, default: '未知' },
  group_name: { type: String, default: '群聊沙箱' },
  card: { type: String, default: '未知' },
  role: { type: String, default: '' },
});

/** 获取当前群聊数据 */
const curGroup = computed(() => {
  return (
    devStore[devStore.curAdapter].group_list.find(
      (group: any) => group.group_id == devStore[devStore.curAdapter].cur_group_id
    ) || {}
  );
});

/** 获取当前私聊数据 */
const curPrivate = computed(() => {
  return (
    devStore[devStore.curAdapter].friend_list.find(
      (friend: any) => friend.user_id == devStore[devStore.curAdapter].cur_private_id
    ) || {}
  );
});
</script>

<style lang="scss" scoped>
.card-title {
  margin-left: 15px;
  font-size: 12px;
  color: #7f7f7f;
}
.card-desc {
  margin-left: auto;
  margin-right: 5px;
  font-size: 12px;
  color: #7f7f7f;
}
.card-list-divider {
  width: 100%;
  height: 0.5px;
  // margin: 10px 0;
  background-color: #d3d3d397;
}
.card-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  // margin-bottom: 15px;
}
.card-list-item:active {
  background-color: #e8e8e8;
}
.introduction {
  display: flex;
  width: 100%;
  height: 40px;
  // padding: 5px;
  .introduction-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .introduction-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    width: 100%;
  }
}
.group-members {
  .group-members-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .group-members-list {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    // border: 2px solid red;
    .group-members-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50px;

      .group-members-item-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #e8e8e8;
      }
      .group-members-item-nickname {
        margin: 8px 0 12px;
        width: 100%;
        text-align: center;
        font-size: 10px;
      }
    }
  }
}
.dismiss-group {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: red;
}
.dismiss-group:hover {
  cursor: pointer;
}
</style>
