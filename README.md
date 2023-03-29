# AI 对话模型, 基于 openai

## 功能 🌟

### Demo-1

- 根据输入生成符合描述的图片
- 输入英文检查拼写是否正确，是否存在语法问题，翻译成中文并补充相关示例

### Demo-2

- 类似 chatgpt 的 AI 对话机器人 🤖️

## 如何使用 🔧

1. 克隆或者 fork 本项目
2. 安装依赖 `pnpm install`

- 由于项目采用 **vercel** `Edge Functions`的模式，因此你需要事先具备 `vercel` 环境,可通过 `npm i vercel -g` 安装

3. 获取 `OPENAI_API_KEY` 信息

- 在 [openai](https://beta.openai.com/) 生成你的 `OPENAI_API_KEY` , 有账号的话直接生成一个即可，没有的话需要先创建账号，具体可以自行搜索如何创建 openai 账号，由于 `openai` 地区限制，该环节可能需要科学上网

`OPENAI_API_KEY` 生成方式如下图所示

<img src="./assets/guide.jpg">

这个 `OPENAI_API_KEY` 将在本地和部署时使用

4. 本地运行

```bash
vercel dev
```

根据提示登录 vercel，推荐关联 github 登录，登录完成后依次回车确认完成初始化

<img src="./assets/vercel-dev.jpg">

<b style="color:pink">由于近期 openai Api 访问受限，本地访问可能会出现超时</b>

5. 部署 vercel 运行（推荐）
   采用 客户端请求 `vercel` -> `vercel` 云函数请求 open ai -> 结果返回客户端来绕开 api 访问受限问题

终端运行,等待`vercel` build 完成即可预览或者发布

```bash
vercel
```

点击终端生成的预览链接，使用第三步生成的 `OPENAI_API_KEY` 即可体验

## 功能截图

- 根据描述生成图片 & 翻译

<img src="./assets/demo-1.jpg">

- 智能 AI 对话

<img src="./assets/demo-2.jpg">
