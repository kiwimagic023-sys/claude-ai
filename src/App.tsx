import { About } from './components/About';
import { Cart } from './components/Cart';
import { Delivery } from './components/Delivery';
import { Events } from './components/Events';
import { Features } from './components/Features';
import { Flavors } from './components/Flavors';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Instagram } from './components/Instagram';
import { Location } from './components/Location';
import { Menu } from './components/Menu';
import { MobileBar } from './components/MobileBar';
import { Navbar } from './components/Navbar';
import { Reviews } from './components/Reviews';
import { Toast } from './components/Toast';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { useReveal } from './hooks/useReveal';
import { useEffect } from 'react';

function Page() {
  useReveal();

  // abre a seção da URL (ex.: /#cardapio) ao carregar
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo">
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
      </main>
      <Footer />
      <Cart />
      <Toast />
      <WhatsAppButton />
      <MobileBar />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Page />
    </CartProvider>
  );
}
