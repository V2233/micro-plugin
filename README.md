# Micro-Plugin

<div align="center">

![Bot](https://img.shields.io/badge/Yunzaijs-Micro--Plugin-blue)
![Bot](https://img.shields.io/badge/Miao--Yunzai-Micro--Plugin-blue)
![Static Badge](https://img.shields.io/badge/QQGroup-397798018-blue?link=http%3A%2F%2Fqm.qq.com%2Fcgi-bin%2Fqm%2Fqr%3F_wv%3D1027%26k%3D6qeMfgydE5k8e_nTorXz0ywmahixBTFw%26authKey%3D9iCyC5qsuluUfxwz4evh5xPmJb3YwlixjoMTxN9He%252BrGu7WiDf2dY8OGk7t%252BGaIu%26noverify%3D0%26group_code%3D397798018)
[![License](https://img.shields.io/static/v1?label=LICENSE&message=GPL-3.0&color=lightrey)](/LICENSE)
<br>
Yunzai-Bot低代码开发管理平台，以下简称小微插件
<br>
[English](EN_README.md) | 简体中文

</div>

## 快速开始

- [基本使用](docs/DOCS.md)

## 特性

- 小微插件允许你便捷地通过Web面板添加机器人的指令和预定义消息

- 插件特别对文本消息段和图片消息段进行了友好处理，即使没有写过代码，你也能快捷制作简易的插件

- 插件面板提供了可视化的图片编辑器，仅通过拖拉拽即可生成美观的图片，您可导出原生HTML或者直接添加到指令列表，后者将自动分配消息段的资源到Yunzai的data/micro-plugin/plugins目录，每个文件夹被视为一个插件包，包括HTML文件、图片、音频、视频、HTML工程文件等，当然面板提供的操作可以让你无视这个资源目录

- 您仍然可以使用模板字符串来插入符合JavaScript语法的变量或表达式，插件提供了消息事件的模板变量，只需要在文本处输入键盘符```/```即可唤出变量列表，这使得您可以制作动态的文本和图片

- 插件内置了简易的文件系统，但它能满足您基本的文件操作需求，包含上传、下载、新建、剪切、移动、复制、删除，您还可以通过点击文件名预览图片、音频、视频。当然，如果需要大批量上传文件，您需要使用其它专业的文件上传工具

- 您可以使用文件系统的代码编辑器来编辑您的项目文件，它附带了多个主题，并支持常见语言的高亮显示、语法检查、代码补全功能，支持的语言有```javascript```、```html```、```css```、```typescript```、```jsx```、```tsx```、```vue```、```json```、```yaml```、```java```、```golang```、```c/cpp```、```python```、```sh```、```markdown```

- 您可在日志面板查看某天机器人的日志

- 状态面板提供了酷酷的系统状态数据大屏，并友好支持移动端页面布局，您还可以在这里查看实时文本和图片消息，点击大屏的群号或好友让机器人快捷回复

- 未来将着重图片编辑器的组件扩展，以满足复杂的图片样式需求

## 环境准备

- Yunzai V4
- 如果您还没有安装此应用，请查看以下文档教程进行安装：<a href="https://yunzai-org.github.io/docs/docs/a-next/translate-your-site/">https://yunzai-org.github.io/docs/docs/a-next/translate-your-site/</a>

## 安装插件

- 下载源码

```sh
git clone --depth=1 https://github.com/V2233/micro-plugin.git ./plugins/micro-plugin
```
或者使用gitee镜像
```sh
git clone --depth=1 https://gitee.com/V2233/micro-plugin.git ./plugins/micro-plugin
```

- 安装依赖

```sh
pnpm i
```

- 重启Yunzai

```sh
pnpm run restart
```

## 消息段

- 目前面板支持添加以下消息段，针对每种类型提供了便捷的添加方法：

| 消息段     | 支持情况 |
| ---------- | :------: |
| [文本]     |    🟢     |
| [QQ 表情]  |    🟢     |
| [图片]     |    🟢     |
| [语音]     |    🟢     |
| [视频]     |    🟢     |
| [@某人]    |    🟢     |
| [引用]     |    🟢     |
| [戳一戳]   |    🟢     |
| [markdown] |    🔴     |
| [按钮]     |    🔴     |
| [合并转发] |    🔴     |

## 鸣谢

- [yunzaijs](https://github.com/yunzai-org/yunzaijs) 插件运行环境

- [Yenai-Plugin](https://gitee.com/yeyang52/yenai-plugin) 系统状态接口参考

- [es-drager](https://github.com/vangleer/es-drager) 拖拽组件