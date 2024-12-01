import { getImagesByAlbum } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const albumName = (await params).name;
    const imagesInAlbum = await getImagesByAlbum(albumName);
    return NextResponse.json({ data: imagesInAlbum, status: true });
  } catch (error) {
    console.error("FUCKING ERROR =>", error);
    return NextResponse.json({
      status: false,
      data: [],
    });
  }
}
