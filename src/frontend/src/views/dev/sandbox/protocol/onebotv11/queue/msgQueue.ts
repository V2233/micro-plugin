/**
 * 消息队列控制器，对当前窗口的消息队列进行处理
 */
import useDevStore from '@/store/modules/dev';
import type { groupMsgQueueItemType, privateMsgQueueItemType } from '../event/type';
const devStore = useDevStore();

export default new (class msgQueueController {
  /**
   * 获取当前机器人信息
   * @returns
   */
  get curBot() {
    return devStore[devStore.curAdapter].friend_list.find(
      friend => friend.user_id == devStore[devStore.curAdapter].cur_bot_id
    );
  }

  get isBotInCurScene() {
    if (devStore[devStore.curAdapter].cur_message_type == 'group') {
      return this.curGroup?.member_list.some(
        m => m.user_id == devStore[devStore.curAdapter].cur_bot_id
      );
    } else {
      return this.curPrivate?.user_id == devStore[devStore.curAdapter].cur_bot_id;
    }
  }

  /**
   * 获取当前群消息队列
   * @returns
   */
  get curGroup() {
    return devStore[devStore.curAdapter].group_list.find(
      group => group.group_id == devStore[devStore.curAdapter].cur_group_id
    );
  }

  /**
   * 获取当前消息队列群索引
   * @returns
   */
  get curGroupIndex() {
    return devStore[devStore.curAdapter].group_list.findIndex(
      group => group.group_id == devStore[devStore.curAdapter].cur_group_id
    );
  }

  /**
   * 获取当前私聊消息队列
   * @returns
   */
  get curPrivate() {
    return devStore[devStore.curAdapter].friend_list.find(
      friend => friend.user_id == devStore[devStore.curAdapter].cur_private_id
    );
  }

  /**
   * 获取当前私聊消息队列索引
   * @returns
   */
  get curPrivateIndex() {
    return devStore[devStore.curAdapter].friend_list.findIndex(
      friend => friend.user_id == devStore[devStore.curAdapter].cur_private_id
    );
  }

  /**
   * 获取当前消息队列场景
   * @returns
   */
  get curQueueType() {
    return devStore[devStore.curAdapter].cur_message_type;
  }

  /**
   * 快捷获取当前消息队列
   * @returns
   */
  get curQueue() {
    return this.curQueueType == 'group' ? this.curGroup?.msg_queue : this.curPrivate?.msg_queue;
  }

  /**---------------------------------群聊消息队列操作------------------------------------- */

  groupQueue_push(data: any) {
    (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    ).push(data);
  }

  groupQueue_pop() {
    (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    ).pop();
  }

  groupQueue_unshift(data: any) {
    (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    ).unshift(data);
  }

  groupQueue_shift() {
    (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    ).shift();
  }

  groupQueue_clear() {
    devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!.msg_queue = [];
  }

  groupQueue_splice(start: number, deleteCount?: number) {
    devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!.msg_queue.splice(
      start,
      deleteCount
    );
  }

  groupQueue_slice(start?: number, end?: number) {
    devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!.msg_queue.slice(start, end);
  }

  groupQueue_setProp<K extends keyof groupMsgQueueItemType>(
    index: number,
    prop: K,
    data: groupMsgQueueItemType[K]
  ) {
    (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    )[index]![prop] = data;
  }

  groupQueue_deleteProp<K extends keyof groupMsgQueueItemType>(index: number, prop: K) {
    delete (
      devStore[devStore.curAdapter]!.group_list[this.curGroupIndex]!
        .msg_queue as groupMsgQueueItemType[]
    )[index]![prop];
  }

  /**---------------------------------私聊消息队列操作------------------------------------- */

  privateQueue_push(data: any) {
    (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    ).push(data);
  }

  privateQueue_pop() {
    (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    ).pop();
  }

  privateQueue_unshift(data: any) {
    (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    ).unshift(data);
  }

  privateQueue_shift() {
    (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    ).shift();
  }

  privateQueue_clear() {
    devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!.msg_queue = [];
  }

  privateQueue_splice(start: number, deleteCount?: number) {
    devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!.msg_queue.splice(
      start,
      deleteCount
    );
  }

  privateQueue_slice(start?: number, end?: number) {
    devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!.msg_queue.slice(start, end);
  }

  privateQueue_setProp<K extends keyof privateMsgQueueItemType>(
    index: number,
    prop: K,
    data: privateMsgQueueItemType[K]
  ) {
    (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    )[index]![prop] = data;
  }

  privateQueue_deleteProp<K extends keyof privateMsgQueueItemType>(index: number, prop: K) {
    delete (
      devStore[devStore.curAdapter]!.friend_list[this.curPrivateIndex]!
        .msg_queue as privateMsgQueueItemType[]
    )[index]![prop];
  }
})();
