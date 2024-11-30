"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import { createAlbum, getUserAlbums } from "@/lib/db";
import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect } from "react";

const AlbumGallery = () => {
  const { data: session } = useSession();
  const { albums, newAlbumName, setNewAlbumName, setAlbums } = useAppStore();

  const fetchAlbums = async () => {
    const userId = (session?.user as any)?.databaseInfo?.id;
    if (!userId) return;
    const userAlbums = await fetch(`/api/album/get/${userId}`).then((r) =>
      r.json()
    );
    console.log("userAlbums:", userAlbums);

    setAlbums(userAlbums.data);
  };

  const handleCreateAlbum = async () => {
    console.log("session:", session);
    const userId = (session?.user as any)?.databaseInfo?.id;
    if (!newAlbumName || !userId) return;
    try {
      const results = await fetch(`/api/album/create`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          name: newAlbumName.replaceAll(" ", "_"),
        }),
      }).then((r) => r.json());

      console.log("results from generating album:", results);

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
      <ul>
        {albums?.map((album) => (
          <li key={album.id}>{album.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumGallery;
