'use client';

import { useEffect, useMemo, useState } from 'react';
import css from './notes.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import NoteList from '@/components/NoteList/NoteList';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import { useDebounce } from 'use-debounce';
import type { NoteTag } from '@/types/note';

type Props = {
  tag?: NoteTag;
};

const PER_PAGE = 10; 

export default function NotesClient({ tag }: Props) {
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryKey = useMemo(
    () =>
      [
        'notes',
        {
          search: debouncedSearch,
          page: currentPage,
          perPage: PER_PAGE,
          tag: tag ?? null,
        },
      ] as const,
    [debouncedSearch, currentPage, tag],
  );

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  let body: React.ReactNode;

  if (isLoading) {
    body = <p>Loading, please wait...</p>;
  } else if (isError) {
    body = <p>Could not fetch the list of notes. {(error as Error).message}</p>;
  } else if (!data || data.notes.length === 0) {
    body = <p>No notes found</p>;
  } else {
    body = <NoteList notes={data.notes} />;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {body}
    </div>
  );
}

