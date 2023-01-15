import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { generateImage } from './generateImage.js'
import { conversation } from './conversation.js'
dotenv.config()
const app = express()

// 处理body
app.use(express.json())
// 处理跨域
app.use(cors())

// 测试请求
app.get('/', (req, res, next) => {
  res.send('Hello Express')
})

// 生成图片
app.post('/generateImage', async (req, res) => {
  const data = await generateImage(req.body?.text)
  res.send({
    status: 'ok',
    data,
  })
})

// 分析语句
app.post('/conversation', async (req, res) => {
  const text = req.body?.text
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  const makeUpQuestions =
    ' 句子里面的单词拼写对不对？这句子的语法对不对？帮我翻译成中文，并且告诉我这句话相关的语法知识,在给我举出几个类似的英语句子'
  conversation(text + makeUpQuestions, res)
})
app.listen(9000, () => {
  console.log('serve is running at http://localhost:9000')
})
