export const OPENAI_KEY = 'OPENAI_KEY'

export const OPENAI_CHAT_HISTORY = 'OPENAI_CHAT_HISTORY'

export const WITHOUT_OPENAI_KEY_TIPS =
  'openai key 不能为空,请先在 Config 页进行配置'

export const UPDATE_OPENAI_KEY_TIPS =
  '成功更新openai key到本地localStorage,开始体验吧～'

export const AI_AVATAR = 'AI_AVATAR'

export const USER_AVATAR = 'USER_AVATAR'

export const GITHUB_REPO_ADDRESS = 'https://github.com/KeyToLove/awesome-gpt'

export const HISTORY_MAX_SIZE = 30

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
