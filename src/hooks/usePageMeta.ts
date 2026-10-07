import { useEffect } from 'react';
import { store } from '../config/site';

const setMeta = (selector: string, attr: string, value: string) => document.querySelector(selector)?.setAttribute(attr, value);

/** atualiza título, descrição e URL canônica de cada página */
export const usePageMeta = (title: string, description: string, path: string) => {
  useEffect(() => {
    document.title = title;
    const url = `${store.website}${path}`;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description, path]);
};
