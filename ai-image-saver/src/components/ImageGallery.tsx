/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ImageCard } from "./ImageCard";

const ImageGallery = () => {
  const { images, setImages, deleteImage } = useAppStore();

  const { data: session } = useSession();

  const [mounted, setMounted] = useState<boolean>(false);

  const fetchUserImages = async () => {
    try {
      const userId = (session?.user as any)?.dbInfo?.id;
      if (!userId) return [];

      const { data } = await fetch(`/api/image/get/by-user/${userId}`).then(
        (r) => r.json()
      );
      return data;
    } catch (error) {
      console.error(
        "\n\nImageGallery => fetchUserImages => error:",
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
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  console.log("images:", images, "\nsortedImages:", sortedImages);
  return (
    <div className="flex flex-row flex-wrap gap-4 pb-12 w-full">
      {sortedImages?.length > 0 &&
        sortedImages.map((image) => (
          <ImageCard
            userId={(session?.user as any)?.dbInfo?.id}
            onDelete={() => deleteImage(image.id, image.url)}
            key={image.id}
            image={image}
          />
        ))}
    </div>
  );
};

export default ImageGallery;

// https://res.cloudinary.com/dif7gcoer/image/upload/v1732890950/ai-generated-images/1_2024-11-29T14:35:48.460Z-ai-generated-image_1732890949347.png
