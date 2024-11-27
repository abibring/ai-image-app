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
