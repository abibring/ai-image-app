/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import { createAlbum, getUserAlbums } from "@/lib/db";
import { useAppStore } from "@/lib/store";

interface Session {
  user?: {
    id: string;
  };
}

const AlbumGallery = ({ session }: { session: Session }) => {
  const { albums, setAlbums, newAlbumName, setNewAlbumName } = useAppStore();

  const fetchAlbums = async () => {
    if (!session?.user?.id) return;
    const userAlbums = await getUserAlbums(session.user.id);
    setAlbums(userAlbums as any);
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName || !session?.user?.id) return;
    try {
      await createAlbum(session.user.id, newAlbumName);
      setNewAlbumName("");
      await fetchAlbums();
      toast({
        title: "Success",
        description: "Album created successfully!",
      });
    } catch (error) {
      console.error("handleCreateAlbum => ERROR:", error);
      toast({
        title: "Error",
        description: "Failed to create album. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1>Albums</h1>
      <input
        type="text"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
      />
      <button onClick={handleCreateAlbum}>Create Album</button>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>{album.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumGallery;
