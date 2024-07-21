import { Client, createLogin, Processor } from 'yunzai'
setTimeout(async () => {
  // 输入login配置
  await createLogin()
  // 运行客户端
  await Client.run().then(async () => {
    // 读取yunzai.config.js
    await Processor.install()
  })
}, 0)