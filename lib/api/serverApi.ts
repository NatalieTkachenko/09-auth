// для функцій, які викликаються у серверних компонентах (до params потрібно додавати cookeis у headers):

// fetchNoteById

import { cookies } from 'next/headers';
import api from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[] | [];
  totalPages: number;
}

export async function fetchNotes(
  search?: string,
  page?: number,
  tag?: string
): Promise<FetchNotesResponse> {
  console.log(`Я отримую нотатки із сторінки ${page}`);
  const cookieStore = await cookies();

  try {
    const response = await api.get<FetchNotesResponse>('notes', {
      params: { search, page, tag },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    console.log(response.data);
    return { notes: response.data.notes, totalPages: response.data.totalPages };
  } catch (error) {
    console.log('The error happend', error);
    throw error;
  }
}

export interface NewNote {
  title: string;
  tag: string;
  content: string;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  console.log('Я створюю нову нотатку', newNote);
  const cookieStore = await cookies();
  const response = await api.post<Note>('notes', newNote, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log(response.data);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  console.log('Я видалю нотатку');
  const cookieStore = await cookies();
  const response = await api.delete<Note>(`notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  console.log(response.data);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
}

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб middleware мав доступ до нових cookie
  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
