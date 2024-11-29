/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getUserImages } from "@/lib/db";
import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ImageGallery = () => {
  const { images, setImages } = useAppStore();
  console.log("images:", images);
  // const { data: session } = useSession();
  const [mounted, setMounted] = useState<boolean>(false);

  const fetchImages = async () => {
    // if (!session?.user?.id) return;
    const userImages = await getUserImages("1");
    console.log("userImages:", userImages);
    setImages(userImages as any);
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      (async () => {
        await fetchImages();
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  console.log("images:", images);
  return <div></div>;
};

export default ImageGallery;

// https://res.cloudinary.com/dif7gcoer/image/upload/v1732890950/ai-generated-images/1_2024-11-29T14:35:48.460Z-ai-generated-image_1732890949347.png
