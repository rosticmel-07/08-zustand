import axios from "axios";
import type { Note, NoteTag } from "@/types/note";
const KEY_API = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const apiUrl = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${KEY_API}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await apiUrl.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
      tag: tag === "all" ? undefined : tag,
    },
  });
  return data;
};

export const createNote = async (
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const { data } = await apiUrl.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiUrl.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const { data } = await apiUrl.get<Note>(`/notes/${noteId}`);

  return data;
};
