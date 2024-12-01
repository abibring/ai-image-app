"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";

// import { CldImage } from "next-cloudinary";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { useAppStore } from "@/lib/store";

import { useToast } from "@/hooks/use-toast";
// import { LoaderCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
    setAlbums,
    albums,
  } = useAppStore();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConnectedToAlbum, setIsConnectedToAlbum] = useState<boolean>(false);
  const [connectedAlbumInfo, setConnectedAlbumInfo] = useState<{
    name: string;
    id: string;
  }>({
    name: "",
    id: "",
  });

  const getAlbums = async () => {
    try {
      const userId = (session as any)?.user?.dbInfo?.id;
      if (!userId) return [];

      const results = await fetch(`/api/album/get/by-user/${userId}`).then(
        (r) => r.json()
      );

      return results;
    } catch (error) {
      console.error("\n\nerror in getAlbums:", error, "\n\n");
      return [];
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const result = await fetch(`/api/image/generate`, {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
      }).then((r) => r.json());

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
      const payload = {
        imageUrl: generatedImage,
        imageName: (imageName || "").trim().toLowerCase().replaceAll(" ", "_"),
        prompt,
      };
      const body =
        isConnectedToAlbum && connectedAlbumInfo.id
          ? { ...payload, albumId: connectedAlbumInfo.id }
          : payload;

      const results = await fetch(`/api/image/save`, {
        method: "POST",
        body: JSON.stringify(body),
      }).then((r) => r.json());

      await getAlbums();

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
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleDialogChange = async () => {
    setIsDialogOpen((prevState) => !prevState);
    const results = await getAlbums();
    setAlbums(results.data);
  };

  const handleAlbumDropdownChange = (e: string) => {
    if (e) {
      const [id, name] = e.split("~~~");
      setIsConnectedToAlbum(true);
      setConnectedAlbumInfo({ name, id });
    } else {
      setIsConnectedToAlbum(false);
      setConnectedAlbumInfo({ name: "", id: "" });
    }
  };

  return (
    <>
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
              // deliveryType="fetch"
              src={generatedImage}
              alt="Generated image"
              width={512}
              height={512}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            Save Image
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2 flex flex-col">
              <div className="space-y-2 flex flex-col items-start gap-3">
                <DialogTitle className="font-medium leading-none">
                  Save Image
                </DialogTitle>

                <Label htmlFor="width">Name</Label>
              </div>
              <Input
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                id="width"
                // defaultValue="100%"
                className="col-span-2 h-8"
              />

              <AlbumDropdown
                albums={albums}
                onChange={handleAlbumDropdownChange}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const AlbumDropdown = ({
  albums,
  onChange,
}: {
  albums: any[];
  onChange: (value: string) => void;
}) => (
  <Select onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Connect to an Album" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Albums</SelectLabel>
        {albums?.length > 0 &&
          albums.map((album) => (
            <SelectItem key={album.id} value={`${album.id}~~~${album.name}`}>
              {album.name}
            </SelectItem>
          ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
