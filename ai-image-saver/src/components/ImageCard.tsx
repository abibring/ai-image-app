"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { BaseSyntheticEvent } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    prompt: string;
    createdAt: string;
    cloudinaryId: string;
  };
  onDelete: () => void;
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  const handleImageFullScreen = (e: BaseSyntheticEvent) => {
    const image = e.target as HTMLImageElement;
    if (!document.fullscreenElement) {
      image.requestFullscreen();
    } else if (!!document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleAddImageToAlbum = () => {};

  return (
    <Card className="flex flex-row">
      <CardContent className="p-2">
        <Image
          // deliveryType="fetch"
          src={image.url}
          alt={image.prompt || "ai generated image"}
          width={300}
          height={300}
          className="rounded-lg min-w-[300px] min-h-[300px]"
          onClick={handleImageFullScreen}
        />
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <p className="text-sm max-w-[40vw]">{image.prompt}</p>
        <div className="flex flex-col gap-2 ">
          <Button variant="default" size="sm" onClick={handleAddImageToAlbum}>
            Add Image To Album
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
