<template>
  <el-card>
    <div class="box">
      <img
        :src="
          userStore.avatar
            ? userStore.avatar
            : `https://q1.qlogo.cn/g?b=qq&s=0&nk=${userStore.masterQQ}`
        "
        class="avatar"
      />
      <div class="bottom">
        <h4 class="title">{{ getTime() }}好！{{ userStore.username }}</h4>
        <p class="subtitle">这里是低代码开发管理平台</p>
      </div>
    </div>
  </el-card>
  <el-card style="margin-top: 20px">
    <el-table class="bot_list" :data="botInfoList">
      <el-table-column label="昵称" prop="nickname" width="80px"></el-table-column>
      <el-table-column label="头像" width="56px">
        <template #="{ row, $index }">
          <img class="bot_avatar" :src="row.avatarUrl" />
        </template>
      </el-table-column>
      <el-table-column label="Tag" prop="countContacts">
        <template #="{ row, $index }">
          <el-tag class="bot_tag mx-1">
            <!-- <el-icon>
              <Avatar />
            </el-icon> -->
            Friends
            {{ row.countContacts.friend }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            <!-- <SvgIcon name="home" color="#409EFF" /> -->
            Groups
            {{ row.countContacts.group }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            <!-- <SvgIcon name="groups" color="#409EFF" /> -->
            Users
            {{ row.countContacts.groupMember }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            <el-icon>
              <ChatLineRound />
            </el-icon>
            {{ row.messageCount.recv }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            <el-icon>
              <Promotion />
            </el-icon>
            {{ row.messageCount.sent }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            <el-icon>
              <Picture />
            </el-icon>
            {{ row.messageCount.screenshot }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            协议：
            {{ row.botVersion }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            平台：
            {{ row.platform }}
          </el-tag>
          <el-tag class="bot_tag mx-1">
            运行时长：
            {{ row.botRunTime }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTime } from '@/utils/time';
import { reqBotInfo } from '@/api/dev/plugin';
// import SvgIcon from '@/components/SvgIcon/index.vue'
import type { BotInfoListType, BotInfoResponseType } from '@/api/dev/plugin/type';
import useUserStore from '@/store/modules/user';
let userStore = useUserStore();

let botInfoList = ref<BotInfoListType>([]);
onMounted(() => {
  getBotInfo();
});

const getBotInfo = async () => {
  let res: BotInfoResponseType = await reqBotInfo();
  // console.log(res)
  if (res.code == 200) {
    botInfoList.value = res.data;
  }
};
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      // color: black;
    }
  }
}

.bot_list {
  .bot_avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .bot_tag {
    margin: 3px 5px;
  }
}

.bottoms {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
