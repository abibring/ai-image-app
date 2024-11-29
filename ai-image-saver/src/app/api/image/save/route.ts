import { NextRequest, NextResponse } from "next/server";
import { saveImage as saveImageToDB } from "@/lib/db";
import fs from "fs";
import path from "path";
import cloudinary from "@/lib/cloudinary";
import https from "https";
import http from "http";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const imageUrl = req?.imageUrl;
    const imageName = req?.imageName;
    const prompt = req?.prompt;
    const userId = req?.userId || "cm432awrc0000gjrbs9h18e8q";
    const imageKey = `${userId}_${imageName}_${Date.now()}`;

    console.log(
      "\nimageUrl:",
      imageUrl,
      "\nimageName:",
      imageName,
      "\nprompt:",
      prompt,
      "\nimageKey:",
      imageKey,
      "\n"
    );
    let cloudinaryResponse: any;
    try {
      cloudinaryResponse = await saveImageToCloudinary(
        imageUrl,
        imageName,
        prompt,
        "cm432awrc0000gjrbs9h18e8q",
        imageKey
      );
      const tmpDir = path.resolve("./tmp");
      const pathname = `${userId}_${imageName}_${Date.now()}.jpg`;

      // Generate a unique temporary file path
      const tempPath = path.join(tmpDir, pathname);
      // Delete the temporary file
      fs.unlinkSync(tempPath);
      console.log("cloudinaryResponse:", cloudinaryResponse);
    } catch (error) {
      console.error("ERROR IN CLOUDINARY:", error);
    }

    if (!cloudinaryResponse?.url) {
      throw new Error("Error saving image to cloudinary");
    }
    let saveToDatabase;
    try {
      saveToDatabase = await saveImageToDB(
        "cm432awrc0000gjrbs9h18e8q",
        prompt,
        cloudinaryResponse.url,
        imageKey
      );

      console.log("saveToDB:", saveToDatabase);
    } catch (error) {
      console.error("ERROR IN SAVING TO DB:", error);
    }
    if (saveToDatabase?.url) {
      return NextResponse.json({
        imageUrl: saveToDatabase?.url,
        status: true,
      });
    } else if (cloudinaryResponse?.url) {
      return NextResponse.json({
        imageUrl: cloudinaryResponse.url,
        status: false,
      });
    }
  } catch (error) {
    console.error(`Error in /api/image/save:`, error);
    return NextResponse.json({
      imageUrl: "",
      status: false,
    });
  }
}

const saveImageToCloudinary = async (
  imageUrl: string,
  imageName: string,
  prompt: string,
  userId: string,
  publicId: string
) => {
  const tmpDir = path.resolve("./tmp");

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true }); // Ensure the directory exists
  }

  const protocol = imageUrl.startsWith("https") ? https : http;
  const pathname = `${userId}_${imageName}_${Date.now()}.jpg`;

  // Generate a unique temporary file path
  const tempPath = path.join(tmpDir, pathname);

  // Download and save the image to a temporary file
  return await new Promise<any>((resolve, reject) => {
    const file = fs.createWriteStream(tempPath);
    protocol
      .get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to fetch image. Status code: ${response.statusCode}`
            )
          );
          return;
        }
        response.pipe(file);
        file.on("finish", async () => {
          file.close();
          // Upload the saved image to Cloudinary
          const uploadResult = await cloudinary.v2.uploader.upload(tempPath, {
            folder: "ai-generated-images",
            public_id: publicId,
            context: `prompt=${prompt}|userId=${userId}`,
          });
          resolve(uploadResult);
        });
      })
      .on("error", (err) => {
        console.error("ERROR IN WRITING FILE:", err);
        if (fs.existsSync(tmpDir)) {
          fs.unlinkSync(tempPath); // Cleanup on error
        }
        reject(err);
      });
  });

  // Delete the temporary file
  fs.unlinkSync(tempPath);

  // return uploadResult;
};
