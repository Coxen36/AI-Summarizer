import OpenAI from "openai";

export async function POST(req: Request) {
  const { text } = await req.json();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a concise summarizer." },
      { role: "user", content: text }
    ]
  });

  return Response.json({
    summary: response.choices[0].message.content,
  });
}
