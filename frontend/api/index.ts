export async function generateImage(prompt: string, config: any) {
  const { userOpenAIKey, onError } = config
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
  const data = await response.json()
  return data
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

export async function conversation(prompt: string, config: any) {
  const { onError, onFinally, onMessage, userOpenAIKey } = config
  const response = await fetch('/api/conversation', {
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
