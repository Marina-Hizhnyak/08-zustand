import axios from 'axios';
import type { Note } from '../types/note';
import type { NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
  tag?: NoteTag; 
}

export interface FetchNotesResponse {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    tag: NoteTag;
    createdAt: string;
    updatedAt: string;
  }>;
  totalPages: number;
  total: number;
}
// export interface FetchNotesResponse {
//   notes: Note[];
//   page: number;
//   perPage: number;
//   totalPages: number;
//   totalItems: number;
//   tag: NoteTag;
// }

export async function fetchNotes({ page, perPage, search, tag }: FetchNotesParams) {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const { data } = await client.get<FetchNotesResponse>('/notes', { params });
  return data;
}



export async function createNote(
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
  const response = await client.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await client.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await client.get<Note>(`/notes/${id}`);
  return data;
}
