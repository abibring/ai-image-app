import { createAlbum } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const userId = req?.userId;
    const albumName = req?.name;

    try {
      const response = await createAlbum(userId, albumName);

      return NextResponse.json({
        data: response,
        status: true,
      });
    } catch (error) {
      console.error("ERROR IN /api/album/create:", error);
      return NextResponse.json({
        data: null,
        status: false,
      });
    }
  } catch (error) {
    console.error("ERROR IN main try/catch of /api/album/create", error);
    return NextResponse.json({
      data: null,
      status: false,
    });
  }
}
