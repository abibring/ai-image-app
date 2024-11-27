import AlbumGallery from "@/components/AlbumGallery";

export default function AlbumsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Albums</h1>
      <AlbumGallery session={{ user: { id: "" } }} />
    </div>
  );
}
