# 一个 chatgpt demo, 目前基于 openai

## 功能

- 根据输入生成符合描述的图片
- 输入英文检查拼写是否正确，是否存在语法问题，翻译成中文并补充相关示例

## 如何使用

1. 克隆本项目
2. 根目录执行 `pnpm bootstrap`
3. 补充 `OPENAI_API_KEY` 信息

- 在 [openai](https://beta.openai.com/) 生成你的 `OPENAI_API_KEY` , 有账号的话直接生成一个即可，没有的话需要先创建账号，具体可以自行搜索如果创建 openai 账号

`OPENAI_API_KEY`生成方式如下图所示

<img src="./guide.jpg">

- 在 `packages/server` 目录下新建 `.env` 文件,并填上你的 `OPENAI_API_KEY` ,格式如下

```
OPENAI_API_KEY=Your_key
```

4. 分别运行前后端服务,浏览器访问前端服务对应地址即可开始体验

packages/frontend 目录

```cmd
pnpm run start
```

packages/server 目录

```cmd
pnpm run start
```
