import type { Metadata } from 'next';
import css from './page.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';


const BASE_URL = process.env.SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Create a new note | NoteHub',
  description: 'Start a fresh note and keep your ideas safe.',
  openGraph: {
    title: 'Create a new note | NoteHub',
    description: 'Start a fresh note and keep your ideas safe.',
    url: `${BASE_URL}/notes/action/create`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        alt: 'NoteHub - create a new note',
      },
    ],
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
