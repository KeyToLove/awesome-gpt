export const OPENAI_KEY = 'OPENAI_KEY'

export const OPENAI_CHAT_HISTORY = 'OPENAI_CHAT_HISTORY'

export const OPENAI_CHAT_MODEL = 'OPENAI_CHAT_MODEL'

export const WITHOUT_OPENAI_KEY_TIPS =
  'openai key 不能为空,请先在 Config 页进行配置'

export const UPDATE_OPENAI_KEY_TIPS =
  '成功更新openai key到本地localStorage,开始体验吧～'

export const AI_AVATAR = 'AI_AVATAR'

export const USER_AVATAR = 'USER_AVATAR'

export const GITHUB_REPO_ADDRESS = 'https://github.com/KeyToLove/awesome-gpt'

export const HISTORY_MAX_SIZE = 30

export const PROMPT_MAP = [
  {
    title: '生成周报',
    key: 'weeklyNewspaper',
    description: '根据日常工作内容，提取要点并适当扩充，以生成周报。',
    markdown: true,
  },
  {
    title: '小红书风格',
    key: 'littleRedBook',
    description: '将文本改写成类似小红书的 Emoji 风格。',
    markdown: false,
  },
  {
    title: '写作助手',
    key: 'writingHelper',
    description: '用于优化文本的语法、清晰度和简洁度，提高可读性',
    markdown: false,
  },
  {
    title: '编写测试用例',
    key: 'testCase',
    description: '通过输入工具函数来生成JEST的测试用例',
    markdown: true,
  },
  {
    title: '编写正则表达式',
    key: 'generateRegExp',
    description: '通过输入信息生成对应的javascript正则表达式',
    markdown: true,
  },
  {
    title: '健身教练',
    key: 'fitnessAdvice',
    description: '通过输入身高、体重、年龄等指标，来制定健身方案。',
    markdown: false,
  },
]

export const PROMPT_COLOR_MAP = [
  '#75581e',
  '#dfd545',
  '#8c2f00',
  '#ff6100',
  '#cf92e0',
  '#127f82',
]
