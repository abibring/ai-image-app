import { openai } from "@/ai/ai";

type IResponseFormat = "url" | "b64_json" | null | undefined;

// if using buffer, need to do Buffer.from(generateImage('prompt', 'b64_json'), 'base64');
export async function generateImage(
  prompt: string,
  response_format: IResponseFormat = "url"
): Promise<string | Buffer | undefined> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format,
  });

  const isUrl = response_format === "url";
  console.log("response.data:", response.data);
  return isUrl ? response.data[0].url || "" : response.data[0]?.b64_json;
}
