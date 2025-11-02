import Notes from './Notes.client';
import { Metadata } from 'next';

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';

interface NotesProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const { search = '', page = '1' } = await searchParams;
  return {
    title: `${slug[0]} Notes`,
    description: `Notes: category ${slug[0]}, page ${page}, keyword ${search}`,
    openGraph: {
      title: `${slug[0]} Notes`,
      description: `Notes: category ${slug[0]}, page ${page}, keyword ${search}`,
      url: `08-zustand-silk-ten.vercel.app/notes/filter/${slug[0]}`,
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

export default async function NotesPage({ searchParams, params }: NotesProps) {
  const queryClient = new QueryClient();

  const { search = '', page = '1' } = await searchParams;

  const pageNumber = +page;

  const { slug } = await params;
  const tag = slug[0] && slug[0] !== 'All' ? slug[0] : undefined;

  await queryClient.prefetchQuery({
    queryKey: tag
      ? ['noteList', search, pageNumber, tag]
      : ['noteList', search, pageNumber],
    queryFn: () => fetchNotes(search, pageNumber, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes initialSearch={search} initialPage={pageNumber} tag={tag} />
    </HydrationBoundary>
  );
}
