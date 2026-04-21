import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { currentEquation, allSteps } = await request.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful math tutor. The student is solving an equation.

Current equation: ${currentEquation}

Give a helpful hint for the NEXT step. Be encouraging but don't give away the answer.
Keep it to 1-2 sentences.`;

    const result = await model.generateContent(prompt);
    const hint = result.response.text();

    return NextResponse.json({
      hint: hint,
    });
  } catch (error) {
    console.error("Hint error:", error);
    return NextResponse.json(
      { error: "Failed to get hint" },
      { status: 500 }
    );
  }
}