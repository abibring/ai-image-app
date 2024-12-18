import { create } from "zustand";
import { deleteImage } from "./db";
import { Album, Image } from "@prisma/client";

// interface Image {
//   albumId: string;
//   cloudinaryId: string;
//   createdAt: string;
//   id: string;
//   prompt: string;
//   updatedAt: string;
//   url: string;
//   userId: string;
// }

// interface Album {
//   id: string;
//   name: string;
//   coverImage?: string;
//   imageCount: number;
//   createdAt?: string;
//   userId?: string;
//   images?: Image[];
// }

interface AppState {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generatedImage: string | null;
  setGeneratedImage: (image: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  images: Image[];
  setImages: (images: Image[]) => void;
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  newAlbumName: string;
  setNewAlbumName: (name: string) => void;
  imageName: string;
  setImageName: (imageName: string) => void;
  deleteImage: (id: string, imageUrl: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),
  imageName: "",
  setImageName: (imageName) => set({ imageName }),
  generatedImage: null,
  setGeneratedImage: (image) => set({ generatedImage: image }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  images: [],
  setImages: (images) => set({ images }),
  albums: [],
  setAlbums: (albums) => set({ albums }),
  newAlbumName: "",
  setNewAlbumName: (name) => set({ newAlbumName: name }),
  deleteImage: async (id, imageUrl) => {
    const images = get().images;
    const newImages = images.filter((image) => image.url !== imageUrl);
    await deleteImage(id, imageUrl);
    set({ images: newImages });
  },
}));
