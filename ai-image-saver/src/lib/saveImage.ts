// pages/api/saveImage.js
import { s3 } from "@/lib/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import sharp from "sharp";
import { Readable } from "stream";

export const uploadToS3 = async (
  imageBuffer: Buffer | Uint8Array | Blob | string | Readable,
  imageName: string
) => {
  const s3Response = await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `images/${imageName}.jpg`,
      Body: imageBuffer,
      ContentType: "image/jpeg",
      // ACL: 'public-read',
    })
  );

  return s3Response; // This will return the public URL of the uploaded image
};

export const getImageFromS3 = async (imageName: string) => {
  const s3Response = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `images/${imageName}.jpg`,
    })
  );

  return s3Response; // This will return the public URL of the uploaded image
};

// Helper function to convert image to JPG using Sharp
export const convertToJPG = (imageBuffer: Uint8Array | string) => {
  return sharp(imageBuffer)
    .jpeg() // Convert to JPG
    .toBuffer();
};

export const downloadImage = async (imageUrl: string) => {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
};
