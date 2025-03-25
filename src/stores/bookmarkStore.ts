import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface BookmarkState {
    bookmarkedTitles: string[]
    loadBookmarks: () => Promise<void>
    toggleBookmark: (title: string) => Promise<void>
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
    bookmarkedTitles: [],
    loadBookmarks: async () => {
        try {
            const json = await AsyncStorage.getItem('@bookmarkedCerts')
            if(json !== null) {
                const parsed = JSON.parse(json)
                set({ bookmarkedTitles: parsed })
            }
        } catch (e) {
            console.error('bookmark 불러오기 실패', e)
        }
    },
    toggleBookmark: async (title) => {
        const prev = get().bookmarkedTitles
        const updated = prev.includes(title)
            ? prev.filter((t) => t !== title)
            : [...prev, title]

        set({ bookmarkedTitles: updated })
        await AsyncStorage.setItem('@bookmarkedCerts', JSON.stringify(updated))
    }
}))