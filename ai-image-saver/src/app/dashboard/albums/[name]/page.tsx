/* eslint-disable @typescript-eslint/no-explicit-any */

import AlbumImageGallery from "@/components/AlbumImageGallery";

export default async function AlbumsPage({ params }: any) {
  const albumName = (await await params).name;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {albumName.replaceAll("_", " ")}
      </h1>
      <AlbumImageGallery albumName={albumName} />
    </div>
  );
}
