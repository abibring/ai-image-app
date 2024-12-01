"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Album, Image as PrismaImage } from "@prisma/client";

import { CldImage } from "next-cloudinary";
import clsx from "clsx";

interface IPrismaImage {
  images: PrismaImage[];
}

interface AlbumCardProps {
  album: Album & Partial<IPrismaImage>;
  onDelete: () => void;
}

export function AlbumCard({ album, onDelete }: AlbumCardProps) {
  return (
    <Link href={`/dashboard/albums/${album.name}`}>
      <Card>
        <CardContent className="p-2">
          {album?.images?.[0]?.url ? (
            <Image
              // deliveryType="fetch"
              src={album.images[0].url}
              alt={album.name}
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          ) : (
            <div
              className={clsx(
                "flex items-center justify-center",
                "w-full h-[200px]",
                "bg-gray-200 rounded-lg"
              )}
            >
              No images
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <h3 className="font-semibold">{album.name}</h3>
            <p className="text-sm text-gray-500">
              {album?.images?.length} images
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
