import OpenAIStream, { OpenAIStreamPayload } from '../utils/openAIStreams'
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'hnd1'],
}

const chat = async (req: Request) => {
  const { messages, api_key, model } = await req.json()

  const payload: OpenAIStreamPayload = {
    model,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2048,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}
export default chat
