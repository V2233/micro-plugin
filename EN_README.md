# Micro-Plugin

<div align="center">

![Bot](https://img.shields.io/badge/Yunzaijs-Micro--Plugin-blue)
![Bot](https://img.shields.io/badge/Miao--Yunzai-Micro--Plugin-blue)
![QQ](https://img.shields.io/badge/QQGroup-397798018-blue?link=http%3A%2F%2Fqm.qq.com%2Fcgi-bin%2Fqm%2Fqr%3F_wv%3D1027%26k%3D6qeMfgydE5k8e_nTorXz0ywmahixBTFw%26authKey%3D9iCyC5qsuluUfxwz4evh5xPmJb3YwlixjoMTxN9He%252BrGu7WiDf2dY8OGk7t%252BGaIu%26noverify%3D0%26group_code%3D397798018)
[![License](https://img.shields.io/static/v1?label=LICENSE&message=GPL-3.0&color=lightrey)](/LICENSE)
<br>
Yunzai Bot Low Code Development Management Platform, hereinafter referred to as Micro-Plugin
<br>
[简体中文](README.md) | English

</div>

## Quick Start

- [Basic usage](docs/DOCS.md)

## Characteristics

- Micro-Plugin allow you to easily add robot commands and predefined messages through a web panel
  
- The plugin is particularly user-friendly for text and image message segments, allowing you to quickly create simple plugins even if you haven't written any code before
  
- The plugin panel provides a visual image editor that can generate beautiful images simply by dragging and dropping. You can export native HTML or directly add it to the instruction list, which will automatically allocate message segment resources to Yunzai's data/micro plugin/plugins directory. Each file folder is treated as a plugin package, including HTML files, images, audio, video, HTML project files, etc. Of course, the operations provided by the panel can make you ignore this resource directory
  
- You can still use template strings to insert variables or expressions that conform to JavaScript syntax. The plugin provides template variables for message events, which can be called up by simply entering keyboard characters in the text field. This allows you to create dynamic text and images

- The plugin comes with a simple file system, but it can meet your basic file operation needs, including uploading, downloading, creating, cutting, moving, copying, and deleting. You can also preview images, audio, and videos by clicking on the file name. Of course, if you need to upload files in large quantities, you will need to use other professional file upload tools

- You can use the file system's code editor to edit your project files, which comes with multiple themes and supports highlighting, syntax checking, and code completion functions for common languages. The supported languages include ```javascript```、```html```、```css```、```typescript```、```jsx```、```tsx```、```vue```、```json```、```yaml```、```java```、```golang```、```c/cpp```、```python```、```sh```、```markdown```

- You can view the logs of a robot on a certain day in the log panel

- The status panel provides a cool system status data big screen and friendly support for mobile page layout. You can also view real-time text and image messages here, click on the group number or friends on the big screen to make the robot reply quickly

- In the future, we will focus on expanding the components of image editors to meet complex image style requirements

## Environmental preparation

- Yunzai V4
- If you have not yet installed this application, please refer to the following documentation tutorials for installation(dev branch):<a href="https://yunzai-org.github.io/docs/docs/a-next/translate-your-site/">https://yunzai-org.github.io/docs/docs/a-next/translate-your-site/</a>

## Installing plugins

- Download source code

```sh
git clone --depth=1 https://github.com/V2233/micro-plugin.git ./plugins/micro-plugin
```

- Installation dependencies

```sh
pnpm i --filter ./plugins/micro-plugin
```

- Restart Yunzai

```sh
pnpm run restart
```

## Message segment

- Currently supports the following

| Message segment | Support status |
| --------------- | :------------: |
| [Text]          |       🟢        |
| [QQ emoji]      |       🟢        |
| [Image]         |       🟢        |
| [Voice]         |       🟢        |
| [Video]         |       🟢        |
| [@ Someone]     |       🟢        |
| [Reply]         |       🟢        |
| [Poke]          |       🟢        |
| [markdown]      |       🔴        |
| [button]        |       🔴        |
| [Forward]       |       🔴        |

## Backend usage

- Directly use the browser to access the backend address sent to you by the robot after booting
> Note: If you are using a cloud server, please use the public network address to access it. If you are using an intranet server, you can use the intranet address to access it

- Go to [Micro Panel download address](https://tianstudio.lanzoub.com/b004iib74j) to download the Android APP of Micro Panel(Password: micro) and fill in the server IP address and account password to access it

## Thanks

- [yunzaijs](https://github.com/yunzai-org/yunzaijs) Plugin runtime environment
- [Yenai-Plugin](https://gitee.com/yeyang52/yenai-plugin) System State Interface Reference
- [es-drager](https://github.com/vangleer/es-drager) Drageable Editor
- [TianStudio](https://github.com/tiancra) Micro Panel APP Developer
