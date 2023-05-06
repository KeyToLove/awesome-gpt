// 生成 8 位 唯一ID
export const generateUid = (): number => {
  return Number(String.prototype.slice.call(Math.random(), -8))
}

export const isIncludeCodeBlock = (str: string): boolean => {
  const reg = /```[\s\S]*?```/
  return reg.test(str)
}
