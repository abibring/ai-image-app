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
      console.error(
        "\n\nAlbumImageGallery => fetchUserImages => error:",
        error,
        "\n\n"
      );
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

  const sortedImages = images.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-row gap-x-2 gap-y-3 pb-12 px-2 flex-wrap">
      {sortedImages?.length > 0 &&
        sortedImages.map((image) => (
          <ImageCard
            userId={(session?.user as any)?.dbInfo?.id}
            onDelete={() => deleteImage(image.id, image.url)}
            key={image.id}
            image={image}
            isAlbumView={true}
          />
        ))}
    </div>
  );
};

export default AlbumImageGallery;

// https://res.cloudinary.com/dif7gcoer/image/upload/v1732890950/ai-generated-images/1_2024-11-29T14:35:48.460Z-ai-generated-image_1732890949347.png
