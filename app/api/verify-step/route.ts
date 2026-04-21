import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { previousEquation, currentEquation, explanation, allSteps } =
      await request.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a mathematics tutor. Verify if the student's step is correct.

Previous equation: ${previousEquation}
Student's equation: ${currentEquation}
Explanation: ${explanation}

Check if the student correctly manipulated the equation. Consider:
1. Is the algebra correct?
2. Are both sides equal?
3. Did they follow proper mathematical rules?

Respond in JSON format:
{
  "isCorrect": true/false,
  "feedback": "Brief feedback message",
  "nextStep": "What should be done next (if incorrect)"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const verification = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      isCorrect: verification.isCorrect,
      feedback: verification.feedback,
      nextStep: verification.nextStep || "",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify step" },
      { status: 500 }
    );
  }
}