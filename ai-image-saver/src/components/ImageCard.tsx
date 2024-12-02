"use client";

import { BaseSyntheticEvent } from "react";

import Image from "next/image";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";

import { Image as ImagePrisma } from "@prisma/client";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { PopoverTrigger } from "./ui/popover";
import clsx from "clsx";

// import { CldImage } from "next-cloudinary";

interface ImageCardProps {
  image: ImagePrisma;
  onDelete: () => void;
  userId: string;
  isAlbumView?: boolean;
}

export function ImageCard({
  image,
  onDelete,
  userId,
  isAlbumView = false,
}: ImageCardProps) {
  const handleImageFullScreen = (e: BaseSyntheticEvent) => {
    const image = e.target as HTMLImageElement;
    if (!document.fullscreenElement) {
      image.requestFullscreen();
    } else if (!!document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleAddImageToAlbum = () => {};

  const [createdYear, createdMonth, createdDay] = new Date(image.createdAt)
    .toISOString()
    .slice(0, 10)
    .split("-");

  const createdDate = `${createdMonth}/${createdDay}/${createdYear}`;

  return (
    <Card className="flex flex-col w-fit gap-2 h-fit">
      <CardContent className="p-2 flex flex-col gap-2">
        <div className="flex flex-row items-start justify-between gap-2">
          <div className="w-6" />
          <p
            className={clsx(
              "font-semibold text-base leading-5 capitalize break-words self-center line-clamp-2",
              "max-w-[300px]",
              "pb-1"
            )}
          >
            {image.cloudinaryId?.replace(`${userId}_`, "")}
          </p>
          <X
            className="cursor-pointer hover:text-[#7e7575] transition-all"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onDelete();
              }
            }}
            onClick={onDelete}
          />
        </div>
        <Image
          // deliveryType="fetch"
          src={image.url}
          alt={image.prompt.slice(0, 50) || "ai generated image"}
          width={300}
          height={300}
          className="rounded-lg min-w-[300px] min-h-[300px] border border-gray-300 shadow-sm self-center"
          onClick={handleImageFullScreen}
        />
      </CardContent>

      <CardFooter className="flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="font-bold">Prompt:</p>
            <Popover>
              <PopoverTrigger asChild>
                <p className="text-sm max-w-[20vw] line-clamp-3 cursor-pointer">
                  {image.prompt}
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-white border border-grey-500 rounded-lg p-2">
                <p className="text-sm max-w-[20vw]">{image.prompt}</p>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-row items-center gap-0.5">
            <p className="font-bold text-sm">Created:</p>
            <p className="text-sm italic">{createdDate}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          {!isAlbumView && (
            <Button variant="default" size="sm" onClick={handleAddImageToAlbum}>
              Add To Album
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
