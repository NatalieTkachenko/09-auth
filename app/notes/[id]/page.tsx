import NoteDetailsClient from './NoteDetails.client';
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';

import { fetchNoteById } from '@/lib/api';

interface NoteDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchNoteById(id);

  return {
    title: `Note: ${data.title}`,
    description: `${data.content.slice(0, 200)}`,
    openGraph: {
      title: `Note: ${data.title}`,
      description: data.content.slice(0, 200),
      url: `https://08-zustand-silk-ten.vercel.app/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo',
        },
      ],
    },
  };
}

export default async function NoteDetail({ params }: NoteDetailProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
