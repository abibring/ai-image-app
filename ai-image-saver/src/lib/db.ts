import { prisma } from "../../prisma/prisma";

export async function saveImage(
  userId: string,
  prompt: string,
  imageUrl: string,
  cloudinaryId = "" // Optional, since it's nullable in your schema
) {
  // Validate required inputs
  if (!userId || !prompt || !imageUrl) {
    throw new Error(
      "Invalid input: userId, prompt, and imageUrl are required."
    );
  }

  console.log(
    "userId:",
    userId,
    "\nprompt:",
    prompt,
    "\nimageUrl:",
    imageUrl,
    "\ncloudinaryId:",
    cloudinaryId
  );
  try {
    return prisma.image.create({
      data: {
        cloudinaryId, // Explicitly set null if not provided
        prompt,
        userId,
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("error in saving image to prisma:", error);
    return null;
  }
  // Create the image record in the database
}

export async function getUserImages(userId: string) {
  return prisma.image.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteImage(imageId: string, imageUrl: string) {
  const deletedImages = await prisma.image.deleteMany({
    where: {
      OR: [{ id: imageId }, { url: imageUrl }],
    },
  });
  return deletedImages;
  // return prisma.image.delete({
  //   where: { id: imageId },
  // });
}

export async function createAlbum(userId: string, name: string) {
  return prisma.album.create({
    data: {
      userId,
      name,
    },
  });
}

export async function getUserAlbums(userId: string) {
  return prisma.album.findMany({
    where: { userId },
    include: {
      _count: {
        select: { images: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteAlbum(albumId: string) {
  return prisma.album.delete({
    where: { id: albumId },
  });
}
