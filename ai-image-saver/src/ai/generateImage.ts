/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ToolFn } from "./types";
import { z } from "zod";
import { openai } from "./ai";

export const generateImageToolDefinition = {
  name: "generate_image",
  parameters: z.object({
    prompt: z
      .string()
      .describe(
        "prompt for the image. Be sure to consider the user's original message when making the prompt. If you are unsure, then ask the user to provide more details."
      ),
  }),
  description: "generate an image based on prompt",
};

type Args = z.infer<typeof generateImageToolDefinition.parameters>;

export const generateImage: ToolFn<Args, Buffer> = async ({
  toolArgs: { prompt },
  userMessage,
}) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  });
  console.log("\n\n DALE DATA:", response.data, "\n\n");
  const imageData = response.data[0].b64_json;
  if (imageData) {
    const buffer = Buffer.from(imageData, "base64");
    return buffer;
    // return imageUrl;
  }
  return Buffer.from([]);
};
