import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { question } = await request.json();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const responseData = await response.json();
    const replay = responseData.choices[0].message.content;
    return NextResponse.json({ replay });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
