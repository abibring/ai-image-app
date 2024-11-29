import { openai } from "@/ai/ai";

export async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  console.log("response:", response);
  return response.data[0].url || "";
}

// export async function generateImage(prompt: string): Promise<Buffer> {
//   const response = await openai.images.generate({
//     model: "dall-e-3",
//     prompt: prompt,
//     n: 1,
//     size: "1024x1024",
//     response_format: "b64_json",
//   });
//   console.log("DAL-E response:", response.data);
//   const imageData = response.data[0].b64_json;
//   return imageData ? Buffer.from(imageData, "base64") : Buffer.from([]);
// }
