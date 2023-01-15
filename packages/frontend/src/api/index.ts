import axios from 'axios'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export function generateImage(text: string) {
  return axios.post('/api/generateImage', {
    text,
  })
}

export function conversation(text: string, onMessage: (data: string) => void) {
  const controller = new AbortController()
  const signal = controller.signal
  fetchEventSource('/api/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
    signal: signal,
    onmessage(ev) {
      // 对话完毕的标识
      if (ev.data === '[DONE]') {
        return controller.abort()
      }
      const data = JSON.parse(ev.data).choices[0].text
      onMessage(data)
    },
    onclose() {
      console.log('close~~')
    },
    onerror(err) {
      console.log(err, 'error~~')
    },
  })
  // const es = new EventSource(`/api/conversation?text=${text}`)
  // es.onmessage = d => {
  //   if (d.data === '[DONE]') {
  //     es.close()
  //     return
  //   }
  //   const text = JSON.parse(d.data).choices[0].text
  //   onMessage(text)
  // }
}
