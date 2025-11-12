'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NotePreview.client.module.css';

type Props = { id: string };

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<Note, Error>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const close = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.push('/notes/filter/All');
    } else {
      router.back();
    }
  };

  let body: React.ReactNode = null;
  if (isLoading) body = <p className={css.status}>Loading...</p>;
  else if (isError) body = <p className={css.status}>Error: {error.message}</p>;
  else if (data)
    body = (
      <div className={css.wrapper}>
        <button type="button" className={css.closeBtn} onClick={close} aria-label="Close">×</button>
        <h2 className={css.title}>{data.title}</h2>
        <p className={css.tag}>{data.tag}</p>
        <div className={css.body}>{data.content}</div>
      </div>
    );

  return <Modal onClose={close}>{body}</Modal>;
}
