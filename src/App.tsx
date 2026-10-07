import { Footer } from './components/Footer';
import { MobileBar } from './components/MobileBar';
import { Navbar } from './components/Navbar';
import { ProductDialog } from './components/ProductDialog';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ProductDialogProvider } from './context/ProductDialogContext';
import { useReveal } from './hooks/useReveal';
import { usePath } from './lib/router';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';

const routes: Record<string, () => React.ReactElement> = {
  '/': HomePage,
  '/cardapio': MenuPage,
  '/privacidade': PrivacyPage,
};

function Layout() {
  const path = usePath();
  useReveal();
  const Page = routes[path] ?? NotFoundPage;

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Navbar path={path} />
      <main id="conteudo" key={path}>
        <Page />
      </main>
      <Footer />
      <ProductDialog />
      <WhatsAppButton />
      <MobileBar />
    </>
  );
}

export default function App() {
  return (
    <ProductDialogProvider>
      <Layout />
    </ProductDialogProvider>
  );
}
