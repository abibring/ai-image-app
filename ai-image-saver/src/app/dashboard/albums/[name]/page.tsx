import AlbumImageGallery from "@/components/AlbumImageGallery";

export default async function AlbumsPage({ params }: any) {
  const albumName = (await await params).name;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {albumName.replaceAll("_", " ").replaceAll("-", " ")}
      </h1>
      <AlbumImageGallery albumName={albumName} />
    </div>
  );
}
