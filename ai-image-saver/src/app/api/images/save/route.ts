import { NextRequest, NextResponse } from "next/server";
import {
  convertToJPG,
  downloadImage,
  getImageFromS3,
  uploadToS3,
} from "../../../../lib/saveImage";
import { saveImage } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const imageUrl = (await request.json())?.imageUrl;
    const imageName = (await request.json())?.imageName;
    const prompt = (await request.json())?.prompt;

    // Step 1: Fetch the image from the OpenAI URL
    const imageBuffer = await downloadImage(imageUrl);

    // Step 2: (Optional) Convert the image to JPG (if not already)
    const imageJpgBuffer = await convertToJPG(imageBuffer);

    // Step 3: Upload the image to S3
    const s3Url = await uploadToS3(imageJpgBuffer, imageName);
    console.log("s3Url:", s3Url);
    const body = await getImageFromS3(imageName);
    const url = (await body?.Body?.transformToString()) || "";
    // Step 4: Save to database
    console.log("url:", url);
    const res = await saveImage("1", prompt, url);
    console.log("res:", res);
    return NextResponse.json({
      imageUrl: s3Url,
      succeeded: true,
    });
  } catch (error) {
    console.error(`Error in /api/image/generate:`, error);
    return NextResponse.json({
      imageUrl: "",
      succeeded: false,
    });
  }
}
