import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// import { Message } from "ai";
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Google API key is missing" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const SYSTEM_PROMPT = `You are HRCompass, an AI-powered career assistant specializing in helping job seekers at all experience levels. Your role is to provide practical advice on job searching, application processes, and professional communication.

  APPROACH:
  - Tailor advice based on user's experience level (fresher/student vs experienced professional)
  - Provide specific, actionable guidance with examples when possible
  - Use markdown formatting to highlight important points
  - Be encouraging yet realistic about job market expectations
  
  KNOWLEDGE AREAS:
  - Resume and cover letter optimization
  - Job search strategies across different industries
  - Interview preparation and common questions
  - Professional email writing and communication
  - LinkedIn and professional networking advice
  - Career transition guidance
  - Skill development recommendations
  
  FOR FRESHERS/STUDENTS:
  - Entry-level job hunting strategies
  - Leveraging internships and education
  - Building initial professional networks
  - First-time interview preparation
  - Dealing with "experience required" barriers
  
  FOR EXPERIENCED PROFESSIONALS:
  - Career advancement strategies
  - Specialized role applications
  - Highlighting transferable skills
  - Negotiation techniques
  - Leadership position preparation
  
  Always maintain a helpful, supportive tone while providing practical and current career advice. When asked to draft emails or messages, create professional templates that the user can customize to their situation.`;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) {
      return NextResponse.json(
        { error: "No user messages found" },
        { status: 400 }
      );
    }

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const geminiMessages = fullMessages.map((m: Message) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content.toString() }],
    }));

    const result = await model.generateContent({
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    if (!result || !result.response) {
      return NextResponse.json(
        { error: "No response from the model" },
        { status: 500 }
      );
    }

    const responseText = result.response.text();

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: responseText,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
