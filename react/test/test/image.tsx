// ./image.tsx
import React from 'react'
import { Component, Puppeteer } from 'yunzai/utils'
import Hello, { type DataType } from './hello.tsx'
// 初始化 组件渲染对象
const Com = new Component()
export class Image {
  Pup: typeof Puppeteer.prototype = null
  /**
  * 初始化运行Puppeteer
  */
  constructor() {
    // init
    this.Pup = new Puppeteer()
    // start
    this.Pup.start()
  }

  /**
  * 注意，不设置json_dir时，
  * html_head路径应该是../public/output.css
  * 且html_head默认值路径也是../public/output.css
  * 因此，不增加其他head的话，html_head和join_dir都可以省略
  */
  #HtmlHead = `<link rel="stylesheet" href="../../react/public/output.css"></link>`

  /**
   * 为指定用户生成html 生成指定数据下的html文件
   * @returns
   */
  createHello(uid: number, data: DataType) {
    // 生成 html 地址 或 html字符串
    const Address = Com.create(<Hello data={data} />, {
      // html/hello/uid.html
      join_dir: 'hello',
      html_name: `${uid}.html`,
      html_head: this.#HtmlHead,
      // 在底部增加其他内容
      // html_body: `<script src=""> </script>`
      // 不生成文件，返回的将是html字符串
      // file_create:false,
    })
    return this.Pup.render(Address)
  }
}
// 初始化 图片生成对象
export const imgae = new Image()