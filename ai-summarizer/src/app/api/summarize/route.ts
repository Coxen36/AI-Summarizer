// import OpenAI from "openai";

// export async function POST(req: Request) {
//   const { text } = await req.json();

//   const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//   });

//   const response = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: "You are a concise summarizer." },
//       { role: "user", content: text }
//     ]
//   });

//   return Response.json({
//     summary: response.choices[0].message.content,
//   });
// }// Note: The above code is commented out to prevent execution errors in environments
// where the OpenAI library or API key may not be available. import OpenAI from "openai";

import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Validation
    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return Response.json(
        { error: "Text is too long (max 10,000 characters)" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a concise summarizer. Provide clear, accurate summaries that capture the main points." 
        },
        { role: "user", content: `Summarize the following text:\n\n${text}` }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const summary = response.choices[0].message.content;

    if (!summary) {
      return Response.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    return Response.json({
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
    });

  } catch (error) {
    console.error("Summarization error:", error);
    
    if (error instanceof Error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}