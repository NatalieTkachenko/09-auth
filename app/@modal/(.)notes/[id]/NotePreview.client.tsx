'use client';

import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NotePreview.module.css';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

import { useRouter } from 'next/navigation';

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  return (
    <>
      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      <Modal onClose={handleBack}>
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data?.title}</h2>
            </div>
            <p className={css.content}>{data?.content}</p>
            <p className={css.date}>{data?.createdAt}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
