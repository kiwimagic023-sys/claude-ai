import { useEffect } from 'react';
import { About } from '../components/About';
import { Delivery } from '../components/Delivery';
import { Events } from '../components/Events';
import { Features } from '../components/Features';
import { Flavors } from '../components/Flavors';
import { Gallery } from '../components/Gallery';
import { Hero } from '../components/Hero';
import { Instagram } from '../components/Instagram';
import { Location } from '../components/Location';
import { Menu } from '../components/Menu';
import { Reviews } from '../components/Reviews';
import { usePageMeta } from '../hooks/usePageMeta';

export function HomePage() {
  usePageMeta(
    'Poison Donuts | Os Melhores Donuts da Galáxia',
    'Poison Donuts — donuts gigantes, sabores irresistíveis e uma experiência única na Barra da Tijuca, Rio de Janeiro.',
    '/',
  );

  // abre a seção indicada na URL (ex.: /#eventos)
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
    <>
      <Hero />
      <Features />
      <Flavors />
      <Menu />
      <Delivery />
      <Events />
      <Gallery />
      <About />
      <Reviews />
      <Instagram />
      <Location />
    </>
  );
}
