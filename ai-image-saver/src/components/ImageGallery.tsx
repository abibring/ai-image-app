/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getUserImages } from "@/lib/db";
import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ImageGallery = () => {
  const { images, setImages } = useAppStore();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState<boolean>(false);

  const fetchImages = async () => {
    if (!session?.user?.id) return;
    const userImages = await getUserImages(session.user.id);
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
