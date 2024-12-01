import { generateImage } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const prompt = (await request.json())?.prompt;

    const imageUrl = await generateImage(prompt);

    return NextResponse.json({
      imageUrl,
      status: true,
    });
  } catch (error) {
    console.error(`Error in /api/image/generate:`, error);
    return NextResponse.json({
      imageUrl: "",
      status: false,
    });
  }
}
