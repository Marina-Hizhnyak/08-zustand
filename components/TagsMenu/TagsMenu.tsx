'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './TagsMenu.module.css';
import { TAGS } from '@/types/note';

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const menuId = 'notes-menu';

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={ref} className={css.menuContainer}>
      <button
        type="button"
        className={css.menuButton}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Notes ▾
      </button>

      <ul id={menuId} role="menu" className={css.menuList} hidden={!open}>
        <li className={css.menuItem} role="none">
          <Link href="/notes/filter/All" className={css.menuLink} role="menuitem" onClick={() => setOpen(false)}>
            All
          </Link>
        </li>
        {TAGS.map((tag) => (
          <li key={tag} className={css.menuItem} role="none">
            <Link
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              className={css.menuLink}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

