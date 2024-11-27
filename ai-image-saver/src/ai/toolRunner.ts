import type OpenAI from "openai";
import { generateImage, generateImageToolDefinition } from "./generateImage";

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || "{}"),
  };

  switch (toolCall.function.name) {
    case generateImageToolDefinition.name:
      return generateImage(input);

    default:
      return `Never run this tool: ${toolCall.function.name} again, or else!`;
  }
};
