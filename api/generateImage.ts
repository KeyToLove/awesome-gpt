export const config = {
  runtime: 'edge',
}

export default async function generateImage(req: Request) {
  let { prompt, api_key } = await req.json()

  const OPENAI_API_KEY = api_key || process.env.OPENAI_API_KEY || ''
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: '256x256',
    }),
  })

  console.log('response-----:', response)

  const data = await response.json()

  console.log('data----:', data)

  if (data.error) {
    return new Response(JSON.stringify(data.error), {
      status: 500,
      statusText: data?.error?.message,
    })
  }
  return new Response(JSON.stringify(data))
}
