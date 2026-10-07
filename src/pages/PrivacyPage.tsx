import { links, store } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

export function PrivacyPage() {
  usePageMeta('Política de Privacidade | Poison Donuts', 'Como a Poison Donuts trata as informações de quem usa este site.', '/privacidade');
  return (
    <article className="legal">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="eyebrow">Transparência</p>
          <h1 className="section-title">Política de <span className="text-gradient">privacidade</span></h1>
        </div>
      </header>
      <div className="container legal__body">
        <p>Esta política explica, de forma simples, como as informações de quem usa o site da {store.name} são tratadas, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>

        <h2>1. Quais dados este site usa</h2>
        <ul>
          <li><strong>Carrinho de compras:</strong> os itens que você escolhe ficam salvos apenas no seu próprio navegador (armazenamento local), para o pedido não se perder se você recarregar a página. Eles não são enviados para nenhum servidor nosso.</li>
          <li><strong>Pedidos e orçamentos:</strong> quando você finaliza um pedido ou solicita um orçamento de evento, o site monta uma mensagem com as informações que você digitou (como nome, telefone, endereço e detalhes do pedido) e abre o WhatsApp. A mensagem só é enviada se você tocar em “enviar” no próprio WhatsApp.</li>
        </ul>

        <h2>2. Para que usamos</h2>
        <p>Usamos as informações que você nos envia somente para responder ao seu contato, preparar e entregar o seu pedido ou elaborar o orçamento do seu evento.</p>

        <h2>3. Serviços de terceiros</h2>
        <p>O site exibe um mapa do Google Maps e links para o WhatsApp e o Instagram. Ao usar esses serviços, valem também as políticas de privacidade de cada um deles.</p>

        <h2>4. Seus direitos</h2>
        <p>Você pode pedir a qualquer momento para consultar, corrigir ou apagar as informações que nos enviou. Para isso, fale com a gente pelo telefone/WhatsApp <a href={`tel:+${store.phoneE164}`}>{store.phoneDisplay}</a> ou pelo Instagram <a href={links.instagram} target="_blank" rel="noopener noreferrer">{links.instagramHandle}</a>.</p>
        <p>Para apagar o carrinho salvo no seu navegador, basta usar a opção “Esvaziar carrinho” ou limpar os dados de navegação.</p>

        <h2>5. Atualizações</h2>
        <p>Esta política pode ser atualizada para refletir mudanças no site. A versão em vigor é sempre a publicada nesta página.</p>
      </div>
    </article>
  );
}
