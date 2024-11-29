"use client";

import { useSession } from "next-auth/react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAppStore } from "@/lib/store";

import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function ImageGenerator() {
  const {
    prompt,
    setPrompt,
    generatedImage,
    setGeneratedImage,
    isGenerating,
    setIsGenerating,
    setImageName,
    imageName,
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

      if (result.status) {
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
    const user = session?.user;

    if (!generatedImage || !user) return;

    try {
      const results = await fetch(`/api/image/save`, {
        method: "POST",
        body: JSON.stringify({
          imageUrl: generatedImage,
          imageName: (imageName || "")
            .trim()
            .toLowerCase()
            .replaceAll(" ", "_"),
          prompt,
        }),
      }).then((r) => r.json());

      toast({
        title: results.status ? "Success" : "Failure",
        description: results.status
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
    <Dialog>
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
            <DialogTrigger asChild>
              <Button variant="outline">Save Image</Button>
            </DialogTrigger>
          </div>
        )}
      </div>
      <DialogContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Give this image a name</h4>

            <Label htmlFor="width">Name</Label>
            <Input
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              id="width"
              // defaultValue="100%"
              className="col-span-2 h-8"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
