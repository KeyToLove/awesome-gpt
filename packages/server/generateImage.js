import { Configuration, OpenAIApi } from 'openai'

export async function generateImage(prompt) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(config)

  const response = await openai.createImage({
    prompt, // 图片描述
    size: '256x256', // 图片尺寸
    n: 1, // 图片张数
  })
  const imageUrl = response.data.data[0].url
  return imageUrl
}
