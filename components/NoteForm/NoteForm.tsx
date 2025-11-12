'use client';

import { useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';
import { createNote } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import { TAGS } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';

interface NoteFormProps {
  onCancel?: () => void;
  onCreate?: () => void;
}

export default function NoteForm({ onCancel, onCreate }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const formRef = useRef<HTMLFormElement | null>(null);


  useEffect(() => {
    const f = formRef.current;
    if (!f) return;
    (f.elements.namedItem('title') as HTMLInputElement).value = draft.title;
    (f.elements.namedItem('content') as HTMLTextAreaElement).value = draft.content;
    (f.elements.namedItem('tag') as HTMLSelectElement).value = draft.tag;
  }, [draft]);

  const mutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const payload = {
        title: String(fd.get('title') || ''),
        content: String(fd.get('content') || ''),
        tag: String(fd.get('tag') || 'Todo') as NoteTag,
      };
      return await createNote(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();                  
      onCreate?.();
      router.back();                 
    },
    onError: (e) => {
      console.error('Create note failed:', e);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title' || name === 'content' || name === 'tag') {
      setDraft({ [name]: value } as Partial<typeof draft>);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutation.mutate(fd);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  return (
    <form ref={formRef} className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          placeholder="Enter title"
          required
          minLength={3}
          maxLength={50}
          defaultValue={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          placeholder="Enter content"
          maxLength={1000}
          defaultValue={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
