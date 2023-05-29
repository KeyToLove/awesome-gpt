import {
  encode,
  decode,
  isWithinTokenLimit,
  encodeGenerator,
  decodeGenerator,
} from 'gpt-tokenizer'

// Encode text into tokens
export const text2Tokens = (text: string): number[] => {
  return encode(text)
}

export const calculateTokensCount = (text: string): number => {
  return text2Tokens(text).length
}

// Decode tokens back into text

// const decodedText = decode(tokens)

// Check if text is within the token limit
// returns false if the limit is exceeded, otherwise returns the actual number of tokens (truthy value)

// const withinTokenLimit = isWithinTokenLimit(text, tokenLimit)

// Encode text using generator

// for (const tokenChunk of encodeGenerator(text)) {
//   console.log(tokenChunk, 'tokenChunk')
// }

// Decode tokens using generator

// for (const textChunk of decodeGenerator(tokens)) {
//   console.log(textChunk, 'textChunk')
// }
