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
      const res = await fetch(`/api/image/generate`, {
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
  console.log("generatedImage:", generatedImage);
  const handleSave = async () => {
    const userId = "1" || session?.user?.id;

    if (!generatedImage || !userId) return;

    try {
      const res = await fetch(`/api/image/save`, {
        method: "POST",
        body: JSON.stringify({
          imageUrl: generatedImage,
          imageName: `${new Date().toISOString()}-ai-generated-image`,
          prompt,
        }),
      });
      if (!res.ok) throw new Error("Error");

      const results = await res.json();
      console.log("savedImage:", results);
      toast({
        title: results.succeeded ? "Success" : "Failure",
        description: results.succeeded
          ? "Image saved successfully!"
          : "Failed to save image. Please try again.",
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
