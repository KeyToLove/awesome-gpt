import { type promptInfoType } from '../constants'

export async function generateImage(prompt: string, config: any) {
  const { userOpenAIKey } = config
  const response = await fetch('/api/generateImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      api_key: userOpenAIKey,
    }),
  })
  if (!response.ok) {
    return {
      message: response.statusText || '服务器好像开小差了，请稍后重试',
    }
  }
  try {
    const data = await response.json()
    return data
  } catch (error) {
    return error
  }
}

export async function chatApi(
  messages: { role: 'user' | 'assistant'; content: string }[],
  config: any
) {
  const { onError, onFinally, onMessage, userOpenAIKey } = config
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      api_key: userOpenAIKey,
    }),
  })
  if (!response.ok) {
    onError(response.statusText)
  }

  // This data is a ReadableStream
  const data = response.body

  if (!data) {
    return
  }

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    onMessage(chunkValue)
  }
  onFinally()
}

export async function conversation(promptInfo: promptInfoType, config: any) {
  const { onError, onFinally, onMessage, userOpenAIKey } = config
  const response = await fetch('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      promptInfo,
      api_key: userOpenAIKey,
    }),
  })
  if (!response.ok) {
    onError(response.statusText)
  }

  // This data is a ReadableStream
  const data = response.body
  if (!data) {
    return
  }

  const reader = data.getReader()
  const decoder = new TextDecoder()
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    const chunkValue = decoder.decode(value)
    onMessage(chunkValue)
  }
  onFinally()
}
