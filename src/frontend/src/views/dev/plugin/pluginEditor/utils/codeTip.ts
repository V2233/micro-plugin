export function codeTip() {
  return `
/**
 * 编写后请记得先点击右上角保存代码，然后点击该页面顶部保存按钮即可保存此插件，保存后立即生效！
 * 这是自定义代码段，拥有JavaScript的正式环境，你可以像正常写yunzai的js插件一样编写执行逻辑
 * 该作用域提供了以下变量，包含了yunzai的基本API，你可以在全局直接使用
 * @params e 消息事件变量，包含了消息事件的全部属性和方法
 * @params Bot 全局Bot
 * @params puppeteer 渲染器，提供了如puppeteer.screenshot等方法
 * @params segment 消息段制作
 * @params loader yunzai的插件加载实例
 * @params logger yunzai日志打印
 */

/** 
 * 如果你使用npm方式安装小微插件，那么需要使用模块化导入yunzai的方法，例如const {Config} = await import('yunzai')
 * 如果你使用git安装小微插件，当前代码的执行路径为./plugins/micro-plugin/dist/apps/message.js
 * 换而言之，如果你需要相对路径导入模块，
 * 则需要使用 const puppeteer = await import('../../../../lib/puppeteer/puppeteer.js'),当然该方式不被推荐
 * 注意你不能在这里使用import xxx from 'xxx'语法，
 * 因为所有代码将在函数作用域执行，你可以使用以下的动态导入依赖示例
 */

const moment = (await import('moment')).default
const now = moment().format('YYYY/MM/DD HH:mm:ss')
logger.info('现在是：',now)
e.reply(now)
    `;
}
