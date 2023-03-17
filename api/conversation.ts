import OpenAIStream, { OpenAIStreamPayload } from '../utils/openAIStreams'
export const config = {
  runtime: 'edge',
}

const conversation = async (req: Request) => {
  const makeUpQuestions =
    ' 句子里面的单词拼写对不对？这句子的语法对不对？帮我翻译成中文,再给我举出几个类似的英语句子'
  let { prompt, api_key } = await req.json()
  prompt = prompt + makeUpQuestions

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}
export default conversation
