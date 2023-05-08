type promptType = string | string[]

const translate = (prompts: promptType) => {
  return `接下来你将扮演我的翻译官，若我输入英文,请帮我翻译成中文,再给我举出几个类似的英语句子;若我输入的是中文,请帮我翻译成英文,并列举其中的语法知识。我的输入: ${prompts}`
}

const weeklyNewspaper = (prompts: promptType) => {
  return `请帮我把以下的工作内容填充为一篇完整的周报,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出: ${prompts}`
}

const littleRedBook = (prompts: promptType) => {
  return `请使用 Emoji 风格编辑以下段落，该风格以引人入胜的标题、每个段落中包含表情符号和在末尾添加相关标签为特点。段落内容为: ${prompts}`
}

const fitnessAdvice = (prompts: promptType) => {
  return `我希望你能充当私人教练。我将为你提供一个希望通过体能训练变得更健康、更强壮、更健康的人所需要的所有信息，而你的职责是根据我提供的这些信息为其制定最佳计划。你应该运用你的运动科学知识、营养建议和其他相关因素，以便制定出适合他们的计划,这个人的信息如下: ${prompts}`
}

const writingHelper = (prompts: promptType) => {
  return `作为一名中文写作改进助理，你的任务是改进所提供文本的拼写、语法、清晰、简洁和整体可读性，同时分解长句，减少重复，并提供改进建议。请只提供文本的更正版本，避免包括解释。请从编辑以下文本开始：${prompts}`
}

const templateMap = {
  translate: translate,
  weeklyNewspaper: weeklyNewspaper,
  littleRedBook: littleRedBook,
  writingHelper: writingHelper,
  fitnessAdvice: fitnessAdvice,
}

export default (key: string, prompts: promptType): string => {
  if (!templateMap[key]) {
    new Error('Preset Prompt 不存在')
  }
  return templateMap[key](prompts)
}
