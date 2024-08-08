import OpenAIStream, { OpenAIStreamPayload } from '../utils/openAIStreams'
import generatePrompt from '../utils/generatePrompt'
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'hnd1'],
}

const conversation = async (req: Request) => {
  let { promptInfo, api_key, model } = await req.json()

  const { key, prompts } = promptInfo

  const prompt = generatePrompt(key, prompts)
  const payload: OpenAIStreamPayload = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}
export default conversation
