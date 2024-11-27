import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveImage(userId: string, prompt: string, imageUrl: string) {
  return prisma.image.create({
    data: {
      userId,
      prompt,
      url: imageUrl,
    },
  })
}

export async function getUserImages(userId: string) {
  return prisma.image.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteImage(imageId: string) {
  return prisma.image.delete({
    where: { id: imageId },
  })
}

export async function createAlbum(userId: string, name: string) {
  return prisma.album.create({
    data: {
      userId,
      name,
    },
  })
}

export async function getUserAlbums(userId: string) {
  return prisma.album.findMany({
    where: { userId },
    include: {
      _count: {
        select: { images: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteAlbum(albumId: string) {
  return prisma.album.delete({
    where: { id: albumId },
  })
}

