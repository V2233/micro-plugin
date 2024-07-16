import { Bot } from '#bot';
const bot = await Bot()

interface dataType {
    type: string,
    action?: string,
    params: any
}

type SendMsgType = (
    params: any,
    action: string,
    type?: 'message' | string,
    clientId?: string
) => void;

interface methodType {
    sendMsg: SendMsgType
}

/**
 * 可以将状态反馈给控制台大屏
 * @param data 收到控制台的响应数据
 * @param mt MicroWs的方法集
 */
function makeStdin(text: string, mt: methodType) {
    mt.sendMsg({
        sender: {
            user_id: 114514,
            nickname: '系统提示'
        },
        message: [{
            type: 'text',
            text: text
        }]
    }, 'e_info')
}

/**
 * 处理控制台回复消息
 * @param data 收到控制台的响应数据
 * @param mt MicroWs的方法集
 */
export async function handleReplyMsg(data: dataType, mt: methodType) {
    if (data.type == 'message' && data.action == 'send_message') {
        const { params } = data
        if (params.type == 'group') {
            await bot.sendGroupMsg(params.id, params.msg)
            makeStdin(`发送群聊${params.id}成功！`, mt)
        } else if (params.type == 'private') {
            await bot.sendPrivateMsg(params.id, params.msg)
            makeStdin(`发送私聊${params.id}成功！`, mt)
        } else if (params.type == 'guild') {
            await bot.sendGuildMsg(params.guild_id, params.id, params.msg)
            makeStdin(`发送频道${params.id}成功！`, mt)
        }
    }
}