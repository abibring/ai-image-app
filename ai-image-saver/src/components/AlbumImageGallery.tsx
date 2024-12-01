/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { ImageCard } from "./ImageCard";

const AlbumImageGallery = ({ albumName }: { albumName: string }) => {
  const { images, setImages, deleteImage } = useAppStore();

  const { data: session } = useSession();

  const [mounted, setMounted] = useState<boolean>(false);

  const fetchUserImages = async () => {
    try {
      const userId = (session?.user as any)?.dbInfo?.id;

      if (!userId || !albumName) return [];

      const { data } = await fetch(`/api/image/get/by-album/${albumName}`).then(
        (r) => r.json()
      );

      return data;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);

      (async () => {
        const userImages = await fetchUserImages();
        setImages(userImages);
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2 pb-12">
      {images?.length > 0 &&
        images.map((image) => (
          <ImageCard
            onDelete={() => deleteImage(image.id, image.url)}
            key={image.id}
            image={{
              id: image.id,
              url: image.url,
              prompt: image.prompt,
              createdAt: image.createdAt,
              cloudinaryId: image.cloudinaryId,
            }}
          />
        ))}
    </div>
  );
};

export default AlbumImageGallery;

// https://res.cloudinary.com/dif7gcoer/image/upload/v1732890950/ai-generated-images/1_2024-11-29T14:35:48.460Z-ai-generated-image_1732890949347.png
