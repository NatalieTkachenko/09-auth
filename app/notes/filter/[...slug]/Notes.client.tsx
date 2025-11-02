'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import css from './Notes.module.css';
import Pagination from '@/components/Pagination/Pagination';

import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';

import Link from 'next/link';

interface NotesProps {
  initialSearch: string;
  initialPage: number;
  tag: string | undefined;
}

function Notes({ initialSearch, initialPage, tag }: NotesProps) {
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);

  const { data, isLoading } = useQuery<FetchNotesResponse>({
    queryKey: tag
      ? ['noteList', search, page, tag]
      : ['noteList', search, page],
    queryFn: () => fetchNotes(search, page, tag),
    placeholderData: keepPreviousData,

    throwOnError: true,
  });

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
    console.log(event.selected + 1);
  };

  const handleSearch = useDebouncedCallback((query: string): void => {
    console.log("I've got a query", query);
    if (query !== search) {
      setSearch(query);
      setPage(1);
    }
  }, 400);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={handleSearch} defaultValue={search} />

          {(data?.notes?.length ?? 0) > 0 && (
            <Pagination
              pageCount={data!.totalPages}
              onPageChange={handlePageClick}
              forcePage={page - 1}
            />
          )}
          <Link className={css.button} href="/notes/action/create">
            Create note +
          </Link>
        </header>
        {isLoading && <Loader />}
        <Toaster />
        {(data?.notes?.length ?? 0) > 0 && <NoteList notes={data!.notes} />}
      </div>
    </>
  );
}

export default Notes;
