// import { ChatGPTAPIBrowser, getOpenAIAuth } from 'chatgpt'
import { Configuration, OpenAIApi } from 'openai'

export async function conversation(prompt, res) {
  // 暂不可用
  // const openAIAuth = await getOpenAIAuth({
  //   email: process.env.OPENAI_EMAIL,
  //   password: process.env.OPENAI_PASSWORD,
  // })

  // const api = new ChatGPTAPIBrowser({ ...openAIAuth })
  // await api.initSession()
  // const response = await api.sendMessage(question, {
  //   onProgress,
  // })

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createCompletion(
    {
      model: 'text-davinci-003',
      prompt,
      max_tokens: 2048,
      temperature: 0,
      stream: true,
    },
    {
      responseType: 'stream',
    }
  )
  // 以 stream流的形式推送client
  response.data.pipe(res)
}
