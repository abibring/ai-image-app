"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";

import { saveImage } from "@/lib/db";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function ImageGenerator() {
  const {
    prompt,
    setPrompt,
    generatedImage,
    setGeneratedImage,
    isGenerating,
    setIsGenerating,
  } = useAppStore();
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/generate-image`, {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!res.ok) throw new Error("Error with making message");
      const result = await res.json();

      if (result.succeeded) {
        setGeneratedImage(result.imageUrl);
      }
    } catch (error) {
      console.error("\n\nhandleGenerate => error:", error, "\n\n");
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage || !session?.user?.id) return;

    try {
      await saveImage(session.user.id, prompt, generatedImage);
      toast({
        title: "Success",
        description: "Image saved successfully!",
      });
    } catch (error) {
      console.error("\n\nhandleSave => error:", error, "\n\n");
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
      {generatedImage && (
        <div className="space-y-4">
          <Image
            src={generatedImage}
            alt="Generated image"
            width={512}
            height={512}
            className="rounded-lg"
          />
          <Button onClick={handleSave}>Save Image</Button>
        </div>
      )}
    </div>
  );
}
