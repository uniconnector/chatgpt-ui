# ChatGPT UI

ChatGPT UI是一个开源项目，旨在为用户提供轻松、直观的方式与ChatGPT进行对话。我们相信，对话是连接人与人、人与技术的最强大方式，因此我们创建了这个前端UI工具，使ChatGPT的交互变得更加容易和有趣。

![运行效果预览](screenshot/chatview.png)

## 功能特点：
1. UI包括文件上传功能，满足Alpha GPT-4(All Tools)API接入的UI支持。
2. UI包括Token统计功能，方便统计计费和限制输入。

编码指定如何将文本转换为标记，不同的模型使用不同的编码。

| 编码 | OpenAI 模型  |
|---|---|
| cl100k_base  | gpt-4, gpt-3.5-turbo, text-embedding-ada-002  |
| p50k_base  | Codex models, text-davinci-002, text-davinci-003  |
| r50k_base (or gpt2)  | GPT-3 models like davinci  |

## 预览1：ChatPDF 与文档进行交流
![PDF文件分析效果预览](screenshot/doc%20screenshot.png)

## 预览2：ChatPDF 与文档预览交流
![PDF文件分析效果预览](screenshot/pdf%20view.png)

## 预览3：ChatGPT API 支持[UniConnector](http://portal.uniconnector.com)
![API支持预览](screenshot/api%20screenshot.png)

## 环境要求
开发版本： Node 18.15.0 + Vue 3

## 项目配置
ChatGPT UI的默认配置存储在“.env”文件中。您将需要覆盖一些值以使ChatGPT UI在本地运行。

```env
VITE_APP_URL = 填写OpenAI的API地址或第三方封装的API,格式示例：https://api.openai.com/v1/chat/completions

VITE_API_KEY= 填写OpenAI的ApiKey, 格式示例: sk-FihjnhGKO14eYLmPpV1234BlbkFJUq1lS0RNenkDsjgGLopx

VITE_API_UPLOAD = 填写解析pdf文件的API地址，格式示例: http://domain.com/upload/pdf
```

## 项目初始化

```sh
npm install
```

### 运行开发环境

```sh
npm run dev
```

### 访问项目
```sh
http://localhost:1003
```

### 构建生产环境

```sh
npm run build
```

### 项目交流群

QQ群：321408266

<img src="screenshot/qq.jpg" width="30%" height="30%">
