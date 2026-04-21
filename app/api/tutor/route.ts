import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, subject, lessonType } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `You are an expert tutor for ${subject}. You help students understand concepts, solve problems, and improve their learning.

Current lesson type: ${lessonType}

Guidelines:
- Be encouraging and supportive
- Explain concepts clearly and simply
- Use examples to illustrate points
- Ask questions to check understanding
- Provide hints rather than direct answers when appropriate
- Keep responses concise (2-3 sentences max)
- Use emojis occasionally
- If the student asks about something unrelated to ${subject}, politely redirect them`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt, // ✅ correct way to pass system prompt
    });

    const chat = model.startChat({
      history: [], // start fresh each time
    });

    const result = await chat.sendMessage(message); // ✅ just the user message
    const response = result.response.text();

    return NextResponse.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("Tutor API error:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const errorString = String(error);
    if (errorString.includes("API_KEY_INVALID")) {
      errorMessage = "Invalid API key";
    } else if (errorString.includes("quota")) {
      errorMessage = "API quota exceeded";
    } else if (errorString.includes("not found")) {
      errorMessage = "Model not found";
    }

    return NextResponse.json(
      { error: "Failed to get tutor response", details: errorMessage },
      { status: 500 },
    );
  }
}
