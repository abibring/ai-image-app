import { prisma } from "../../prisma/prisma";

export async function saveImage(
  userId: string,
  prompt: string,
  imageUrl: string,
  cloudinaryId = "",
  albumId = null
) {
  if (!userId || !prompt || !imageUrl) {
    throw new Error(
      "Invalid input: userId, prompt, and imageUrl are required."
    );
  }

  try {
    return prisma.image.create({
      data: {
        cloudinaryId: cloudinaryId || null,
        prompt,
        userId,
        url: imageUrl,
        albumId,
      },
    });
  } catch (error) {
    console.error("error in saving image to prisma:", error);
    return null;
  }
}

export async function getUserImages(userId: string) {
  return prisma.image.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteImage(imageId: string, imageUrl: string) {
  return prisma.image.deleteMany({
    where: {
      OR: [{ id: imageId }, { url: imageUrl }],
    },
  });
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
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getImagesByAlbum(albumName: string) {
  return prisma.image.findMany({
    where: {
      album: {
        name: albumName,
      },
    },
  });
}

export async function saveImageAndConnectToAlbum(
  userId: string,
  prompt: string,
  imageUrl: string,
  albumId: string,
  cloudinaryId = ""
) {
  return prisma.image.create({
    data: {
      cloudinaryId,
      prompt,
      userId,
      url: imageUrl,
      albumId,
    },
  });
}

export async function deleteAlbum(albumId: string) {
  return prisma.album.delete({
    where: { id: albumId },
  });
}
