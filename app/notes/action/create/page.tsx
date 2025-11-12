import type { Metadata } from 'next';
import css from './page.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create a new note | NoteHub',
  description: 'Start a fresh note and keep your ideas safe.',
  openGraph: {
    title: 'Create a new note | NoteHub',
    description: 'Start a fresh note and keep your ideas safe.',
    url: '/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    type: 'website',
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
