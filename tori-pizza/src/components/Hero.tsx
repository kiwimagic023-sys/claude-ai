import { photos, store } from '../config/site';
import { useOpenStatus } from '../hooks/useOpenStatus';
import { scrollToId } from '../lib/scroll';
import { whatsappUrl } from '../lib/whatsapp';
import { IconPizza, IconWhatsApp } from './Icons';

/** capa — a animação de abertura com a rolagem vai entrar antes desta seção */
export function Hero() {
  const status = useOpenStatus();
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__text">
          <span className={`status ${status.open ? 'status--open' : 'status--closed'}`}>
            <span className="status__dot" /> {status.label} <small>· {status.detail}</small>
          </span>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__script">Pizzaria</span>
            Toripizza
          </h1>
          <p className="hero__lead">{store.slogan} Sabores salgados e doces, meio a meio ou do jeito que você quiser, aqui em Toritama.</p>
          <div className="hero__ctas">
            <a className="btn btn--primary btn--lg" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Pedir pelo WhatsApp</a>
            <button className="btn btn--ghost btn--lg" onClick={() => scrollToId('cardapio')}><IconPizza /> Ver cardápio</button>
          </div>
          <p className="hero__meta">⭐ {store.rating.toLocaleString('pt-BR')} no Google · {store.services.join(' · ')}</p>
        </div>
        <div className="hero__photos" aria-hidden="true">
          <img className="hero__photo hero__photo--back" src={photos.chocolateRomeuJulieta} alt="" />
          <img className="hero__photo hero__photo--mid" src={photos.calabresaPortuguesa} alt="" />
          <img className="hero__photo hero__photo--front" src={photos.meioAMeioChocolate} alt="" fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}
