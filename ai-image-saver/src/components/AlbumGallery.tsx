"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { AlbumCard } from "./AlbumCard";

import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

const AlbumGallery = () => {
  const { data: session } = useSession();
  const { albums, newAlbumName, setNewAlbumName, setAlbums } = useAppStore();

  const fetchAlbums = async () => {
    const userId = (session?.user as any)?.dbInfo?.id;
    if (!userId) return;

    const { data: userAlbums } = await fetch(
      `/api/album/get/by-user/${userId}`
    ).then((r) => r.json());

    setAlbums(userAlbums);
  };

  const handleCreateAlbum = async () => {
    const userId = (session?.user as any)?.dbInfo?.id;

    if (!newAlbumName || !userId) return;

    try {
      const results = await fetch(`/api/album/create`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          name: newAlbumName.replaceAll(" ", "_"),
        }),
      }).then((r) => r.json());

      if (results.status) {
        setNewAlbumName("");
        await fetchAlbums();
        toast({
          title: "Success",
          description: "Album created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create album. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("handleCreateAlbum => ERROR:", error);
      toast({
        title: "Error",
        description: "Failed to create album. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAlbums();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2 items-start">
      <h1>Albums</h1>
      <Input
        className="max-w-80"
        type="text"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
      />
      <Button onClick={handleCreateAlbum}>Create Album</Button>
      <ul className="flex flex-row flex-wrap gap-4">
        {albums?.map((album) => (
          <AlbumCard
            key={album.id}
            onDelete={() => console.log("DELETE ME ", album)}
            album={album}
          />
        ))}
      </ul>
    </div>
  );
};

export default AlbumGallery;
