'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

export type Draft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteStore = {
  draft: Draft;
  setDraft: (partial: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (partial) => set({ draft: { ...get().draft, ...partial } }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: 'notehub-draft' } 
  )
);
