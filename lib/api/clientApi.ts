import { dataTagErrorSymbol } from '@tanstack/react-query';
import api from './api';
import type User from '@/types/user';
import type Note from '@/types/note';

// для функцій, які викликаються у клієнтських компонентах:

// fetchNotes
// fetchNoteById
// createNote
// deleteNote

export interface FetchNotesResponse {
  notes: Note[] | [];
  totalPages: number;
}

export interface NewNote {
  title: string;
  tag: string;
  content: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchNotes(
  search?: string,
  page?: number,
  tag?: string
): Promise<FetchNotesResponse> {
  console.log(`Я отримую нотатки із сторінки ${page}`);

  await delay(1000);
  try {
    const response = await api.get<FetchNotesResponse>('notes', {
      params: { search, page, tag },
    });
    console.log(response.data);
    return { notes: response.data.notes, totalPages: response.data.totalPages };
  } catch (error) {
    console.log('The error happend', error);
    throw error;
  }
}

export async function createNote(newNote: NewNote): Promise<Note> {
  console.log('Я створюю нову нотатку', newNote);
  const response = await api.post<Note>('notes', newNote);
  console.log(response.data);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  await delay(3000);
  const response = await api.get<Note>(`notes/${id}`);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  console.log('Я видалю нотатку');
  const response = await api.delete<Note>(`notes/${id}`);
  console.log(response.data);
  return response.data;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await api.post<User>('/auth/register', data);
  console.log(`You created a new user with ${data} credentials`);
  return response.data;
}

export interface LogInRequest {
  email: string;
  password: string;
}

export async function login(data: LogInRequest): Promise<User> {
  const response = await api.post('/auth/login', data);
  return response.data;
}

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

interface UpdateUserRequest {
  username: string;
}

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>('users/me', payload);
  return data;
};
