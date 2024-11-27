import { create } from 'zustand'

interface Image {
  id: string
  url: string
  prompt: string
  createdAt: string
}

interface Album {
  id: string
  name: string
  coverImage?: string
  imageCount: number
}

interface AppState {
  prompt: string
  setPrompt: (prompt: string) => void
  generatedImage: string | null
  setGeneratedImage: (image: string | null) => void
  isGenerating: boolean
  setIsGenerating: (isGenerating: boolean) => void
  images: Image[]
  setImages: (images: Image[]) => void
  albums: Album[]
  setAlbums: (albums: Album[]) => void
  newAlbumName: string
  setNewAlbumName: (name: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  generatedImage: null,
  setGeneratedImage: (image) => set({ generatedImage: image }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  images: [],
  setImages: (images) => set({ images }),
  albums: [],
  setAlbums: (albums) => set({ albums }),
  newAlbumName: '',
  setNewAlbumName: (name) => set({ newAlbumName: name }),
}))

