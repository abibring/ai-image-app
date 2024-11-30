"use client";
import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AlbumCardProps {
  album: {
    id: string;
    name: string;
    coverImage?: string;
    imageCount: number;
  };
  onDelete: () => void;
}

export function AlbumCard({ album, onDelete }: AlbumCardProps) {
  return (
    <Card>
      <CardContent className="p-2">
        {album.coverImage ? (
          <CldImage
            deliveryType="fetch"
            src={album.coverImage}
            alt={album.name}
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
            No images
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <h3 className="font-semibold">{album.name}</h3>
          <p className="text-sm text-gray-500">{album.imageCount} images</p>
        </div>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
