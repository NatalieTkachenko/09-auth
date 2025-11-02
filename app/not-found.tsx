import { Metadata } from 'next';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Not-found page',
  description: 'The page is to be shown for non-existing roots',

  openGraph: {
    title: 'Not-found page',
    description: 'The page is to be shown for non-existing roots',
    url: '08-zustand-silk-ten.vercel.app/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub logo',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
