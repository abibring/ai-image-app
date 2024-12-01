import { getUserImages } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userid: string }> }
) {
  try {
    const userId = (await params).userid;
    const userImages = await getUserImages(userId);
    return NextResponse.json({ data: userImages, status: true });
  } catch (error) {
    console.error("error in /api/image/get/by-user/[userid]", error);
    return NextResponse.json({
      status: false,
      data: [],
    });
  }
}
