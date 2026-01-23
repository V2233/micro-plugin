<template>
  <el-card
    v-if="devStore.scene == 0"
    :body-style="{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }"
    style="height: 100%"
  >
    <div class="top_bar">
      <div class="sub-title">指令列表</div>
      <el-popover placement="bottom" :width="300" trigger="hover">
        <el-input v-model="searchText" placeholder="筛选指令" size="small" @input="searchPlugin">
          <template #append>
            <el-button icon="Search" @click="searchPlugin"></el-button>
          </template>
        </el-input>
        <template #reference>
          <el-button icon="Search" circle style="margin-left: auto"></el-button>
        </template>
      </el-popover>
      <el-button type="primary" icon="Plus" @click="goAddPlugin"> 添加指令 </el-button>
    </div>

    <el-table :data="pluginsList">
      <el-table-column type="index" label="#"></el-table-column>

      <el-table-column label="指令">
        <template #="{ row, $index }">
          {{ row.reg }}
        </template>
      </el-table-column>

      <el-table-column label="消息类型">
        <template #="{ row, $index }">
          <span style="font-size: 12px"
            >[{{ row.message.map((item: any) => item.type).join(',') }}]</span
          >
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #="{ row, $index }">
          <span style="font-size: 12px">{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="120px">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="goEditPlugin($index)"
          ></el-button>
          <el-popconfirm title="删除后不可恢复，您确定吗？" @confirm="deletePlugin($index)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      small
      lazy
      v-model:current-page="page.pageNo"
      v-model:page-size="page.pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :disabled="false"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="pluginsList.length"
      @current-change="pageChange"
      @size-change="sizeChange"
    /> -->
  </el-card>

  <!-- 插件编辑器 -->
  <div class="Plugin_editor" v-if="devStore.isPluginEdited">
    <PluginEditor :editedPluginValue="editedPluginValue" @save-plugin="updatePluginsList" />
  </div>
</template>

<script setup lang="ts">
import { reqDeletePlugin, reqPluginsList } from '@/api/dev/plugin';
import type { pluginResponseType, pluginType } from '@/api/dev/plugin/type';
import useDevStore from '@/store/modules/dev';
import { getFormatDate } from '@/utils/time';
import { onMounted, reactive, ref } from 'vue';
import PluginEditor from './pluginEditor/index.vue';

const devStore = useDevStore();

const pluginsList = ref<pluginType[]>([]);

let pluginsListCopy: pluginType[] = [];

const editedPluginValue = ref({
  id: '',
});

const searchText = ref('');

const page = reactive({
  pageNo: 1,
  pageSize: 10,
});

onMounted(() => {
  getPluginsList();
});

/**
 * 获取插件列表
 * @returns
 */
const getPluginsList = async () => {
  let res: pluginResponseType = await reqPluginsList();
  console.log(res);
  if (res.code == 200) {
    pluginsList.value = res.data;
    pluginsListCopy = res.data;
  }
};

/**
 * 添加插件
 * @returns
 */
const goAddPlugin = () => {
  ((devStore.isPluginEdited = true), (devStore.scene = 1));
  devStore.curEditedMode = 'add';
  editedPluginValue.value.id = getFormatDate();
  devStore.curPluginId = editedPluginValue.value.id;
};

/**
 * 编辑插件
 * @param index 插件索引
 * @returns
 */
const goEditPlugin = async (index: number) => {
  devStore.isPluginEdited = true;
  devStore.scene = 1;
  devStore.curEditedMode = 'update';

  editedPluginValue.value = pluginsList.value[index] as any;
};

/**
 * 处理子组件保存事件
 * @param e 更新后的插件列表
 * @returns
 */
const updatePluginsList = (e: pluginType[]) => {
  pluginsList.value = e;
  pluginsListCopy = e;
};

/**
 * 删除插件
 * @param index 插件索引
 * @returns
 */
const deletePlugin = async (index: number) => {
  let res: pluginResponseType = await reqDeletePlugin(index);
  console.log(res);
  if (res.code == 200) {
    pluginsList.value = res.data;
    pluginsListCopy = res.data;
  }
};

const searchPlugin = () => {
  pluginsList.value = pluginsListCopy.filter(plugin => plugin.reg.includes(searchText.value));
};

// const sizeChange = (e) => {
//   console.log(e)
// }

// const pageChange = (e) => {
//   console.log(e)
// }
</script>

<style scoped lang="scss">
.top_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sub-title {
    position: relative;
    height: 24px;
    width: 100px;
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    align-items: center;
    margin-bottom: 15px;
  }
}
</style>
