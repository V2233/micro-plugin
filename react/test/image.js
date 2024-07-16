import React from 'react';
import { Component, Puppeteer } from 'yunzai/utils';
import Hello from './hello.tsx';
const Com = new Component();
export class Image {
    Pup = null;
    constructor() {
        this.Pup = new Puppeteer();
        this.Pup.start();
    }
    #HtmlHead = `<link rel="stylesheet" href="../../react/public/output.css"></link>`;
    createHello(uid, data) {
        const Address = Com.create(React.createElement(Hello, { data: data }), {
            join_dir: 'hello',
            html_name: `${uid}.html`,
            html_head: this.#HtmlHead,
        });
        return this.Pup.render(Address);
    }
}
export const imgae = new Image();
