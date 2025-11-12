import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import type { Metadata } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const { fetchNoteById } = await import('@/lib/api');
    const note = await fetchNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description = note.content.slice(0, 140);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
        type: 'article',
      },
    };
  } catch {
    const title = 'Note | NoteHub';
    const description = 'View note details.';
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
        type: 'article',
      },
    };
  }
}

type Params = { params: Promise<{ id: string }> };

export default async function NoteDetailsPage({ params }: Params) {
  const { id } = await params;

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid note id');
  }

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

