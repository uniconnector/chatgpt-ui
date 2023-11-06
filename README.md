# ChatGPT UI

ChatGPT UI是一个开源项目，旨在为用户提供轻松、直观的方式与ChatGPT进行对话。我们相信，对话是连接人与人、人与技术的最强大方式，因此我们创建了这个前端UI工具，使ChatGPT的交互变得更加容易和有趣。

![运行效果预览](screenshot/chatview.png)

## ChatPDF 与文档进行交流
![PDF文件分析效果预览](screenshot/doc%20screenshot.png)

## ChatPDF 与文档预览交流
![PDF文件分析效果预览](screenshot/pdf%20view.png)

## ChatGPT API 支持
![API支持预览](screenshot/api%20screenshot.png)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

The default config for ChatGPT UI is stored in the `.env` file. You will need to override some values to get ChatGPT UI to run locally. This is done in `.env.local`.

Start by creating a `.env.local` file in the root of the repository. The bare minimum config you need to get ChatGPT UI to run locally is the following:

```env
VITE_APP_URL = <https://api.openai.com/v1/chat/completions> 

VITE_API_KEY= <your api key of openai>

VITE_API_UPLOAD = <url of upload service>
```

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### 项目交流群

QQ群：321408266

<img src="screenshot/qq.jpg" width="30%" height="30%">
