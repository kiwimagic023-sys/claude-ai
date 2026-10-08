import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { HowToOrder } from './components/HowToOrder';
import { Location } from './components/Location';
import { Menu } from './components/Menu';
import { MobileBar } from './components/MobileBar';
import { Navbar } from './components/Navbar';
import { PizzaIntro } from './components/PizzaIntro';
import { Reviews } from './components/Reviews';
import { Showcase } from './components/Showcase';
import { WhatsAppButton } from './components/WhatsAppButton';
import { useReveal } from './hooks/useReveal';
import { useTilt } from './hooks/useTilt';

export default function App() {
  useReveal();
  useTilt();
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo">
        <PizzaIntro />
        <Features />
        <Showcase />
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
