export type chatItemDetail = {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatItem {
  uid: number
  createTime?: number
  updateTime?: number
  detail: chatItemDetail[]
}

export type promptMapItem = {
  title: string
  key: string
  description: string
  markdown: boolean
}

export type promptInfoType = {
  key: string
  prompts: string | string[]
}
