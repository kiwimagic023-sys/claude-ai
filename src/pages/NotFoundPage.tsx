import { Donut } from '../components/Donut';
import { usePageMeta } from '../hooks/usePageMeta';
import { linkHandler } from '../lib/router';

export function NotFoundPage() {
  usePageMeta('Página não encontrada | Poison Donuts', 'Esta página saiu de órbita.', location.pathname);
  return (
    <section className="not-found">
      <div className="not-found__donut" aria-hidden="true"><Donut art={{ glaze: '#ff6fc0', topping: 'sprinkles' }} seed="404" /></div>
      <p className="eyebrow">Erro 404</p>
      <h1 className="section-title">Esta página saiu de <span className="text-gradient">órbita</span></h1>
      <p className="section-lead">O endereço que você procurou não existe ou mudou de lugar. Que tal voltar para os donuts?</p>
      <div className="hero__ctas">
        <a className="btn btn--primary btn--lg" href="/" onClick={linkHandler('/')}>Voltar ao início</a>
        <a className="btn btn--ghost btn--lg" href="/cardapio" onClick={linkHandler('/cardapio')}>Ver cardápio</a>
      </div>
    </section>
  );
}
