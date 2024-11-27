import { generateImage } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const prompt = (await request.json())?.prompt;
    const imageUrl = await generateImage(prompt);

    console.log("prompt:", prompt);
    console.log("imageUrl:", imageUrl);

    return NextResponse.json({
      imageUrl,
      succeeded: true,
    });
  } catch (error) {
    console.error(`Error in /api/generate-image:`, error);
    return NextResponse.json({
      imageUrl: "",
      succeeded: false,
    });
  }
}
