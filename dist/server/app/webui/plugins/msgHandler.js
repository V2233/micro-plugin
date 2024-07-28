import { Bot } from '../../../../adapter/index.js';

const bot = await Bot();
function makeStdin(text, mt) {
    mt.sendMsg({
        sender: {
            user_id: 114514,
            nickname: '系统提示'
        },
        message: [{
                type: 'text',
                text: text
            }]
    }, 'e_info');
}
async function handleReplyMsg(data, mt) {
    if (data.type == 'message' && data.action == 'send_message') {
        const { params } = data;
        if (params.type == 'group') {
            await bot.sendGroupMsg(params.id, params.msg);
            makeStdin(`发送群聊${params.id}成功！`, mt);
        }
        else if (params.type == 'private') {
            await bot.sendPrivateMsg(params.id, params.msg);
            makeStdin(`发送私聊${params.id}成功！`, mt);
        }
        else if (params.type == 'guild') {
            await bot.sendGuildMsg(params.guild_id, params.id, params.msg);
            makeStdin(`发送频道${params.id}成功！`, mt);
        }
    }
}

export { handleReplyMsg };
