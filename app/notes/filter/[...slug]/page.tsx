import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { TAGS, type NoteTag } from '@/types/note';
import type { Metadata } from 'next';

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filter =
    Array.isArray(slug) && slug.length ? decodeURIComponent(slug[0]) : 'All';

  const title =
    filter === 'All'
      ? 'All notes | NoteHub'
      : `Notes filtered by "${filter}" | NoteHub`;

  const description =
    filter === 'All'
      ? 'Browse all your notes with pagination and search.'
      : `Browse notes filtered by tag "${filter}".`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/notes/filter/${
        Array.isArray(slug) ? slug.join('/') : ''
      }`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      type: 'website',
    },
  };
}

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseTag(slug?: string[]): NoteTag | undefined {
  const raw = slug?.[0];
  if (!raw || raw === 'All') return undefined; 
  const t = decodeURIComponent(raw) as NoteTag;
  if (TAGS.includes(t)) return t;
  notFound(); 
}

const toStr = (v: string | string[] | undefined, d = '') =>
  Array.isArray(v) ? v[0] ?? d : v ?? d;

const toNum = (v: string | string[] | undefined, d: number) => {
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export default async function FilteredNotesPage({ params, searchParams }: Props) {
 
  const { slug } = await params;
  const sp = await searchParams;

  const tag = parseTag(slug);
  const search = toStr(sp.search, '');
  const page = toNum(sp.page, 1);
  const perPage = toNum(sp.perPage, 12);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', { search, page, perPage, tag: tag ?? null }],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialSearch={search}
        initialPage={page}
        perPage={perPage}
        tag={tag}
      />
    </HydrationBoundary>
  );
}
