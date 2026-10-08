import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { HowToOrder } from './components/HowToOrder';
import { Location } from './components/Location';
import { Menu } from './components/Menu';
import { MobileBar } from './components/MobileBar';
import { Navbar } from './components/Navbar';
import { Reviews } from './components/Reviews';
import { WhatsAppButton } from './components/WhatsAppButton';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Features />
        <Menu />
        <HowToOrder />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBar />
    </>
  );
}
