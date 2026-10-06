import { products } from '../config/site';
import { Donut } from './Donut';

const values = [
  { k: 'Criatividade', v: 'Sabores que saem do comum e viram assunto.' },
  { k: 'Sabor', v: 'Recheio generoso e cobertura em cada pedaço.' },
  { k: 'Diversão', v: 'Cultura pop, cores e um universo só nosso.' },
  { k: 'Qualidade', v: 'Cuidado em cada etapa, da massa à caixa.' },
];

export function About() {
  const a = products.find((p) => p.id === 'banoffee')!;
  const b = products.find((p) => p.id === 'pretzel')!;
  const c = products.find((p) => p.id === 'chantilly-morango')!;
  return (
    <section id="sobre" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__visual" data-reveal aria-hidden="true">
          <div className="about__frame about__frame--a"><Donut art={a.art} seed="about-a" /></div>
          <div className="about__frame about__frame--b"><Donut art={b.art} seed="about-b" /></div>
          <div className="about__frame about__frame--c"><Donut art={c.art} seed="about-c" /></div>
          <div className="about__badge"><strong>100%</strong><span>feito para<br />impressionar</span></div>
        </div>
        <div className="about__copy" data-reveal>
          <p className="eyebrow">Sobre nós</p>
          <h2 id="about-title" className="section-title">Mais que donuts. <span className="text-gradient">Uma experiência.</span></h2>
          <p className="section-lead">
            A Poison Donuts nasceu para transformar um simples doce em um momento que você quer repetir. Aqui, cada donut é pensado como um pequeno planeta:
            único, cheio de personalidade e com um sabor que puxa você para a nossa órbita.
          </p>
          <p>
            Misturamos o clássico com o inesperado, a cultura pop com a confeitaria e a diversão com o cuidado nos detalhes. O resultado? Donuts gigantes,
            coberturas brilhantes e recheios que fazem qualquer dia virar ocasião especial. Seja para matar a vontade, presentear alguém ou fazer
            a festa acontecer, a gente está pronto para levar você para outra galáxia.
          </p>
          <dl className="values">
            {values.map((x) => (
              <div key={x.k}><dt>{x.k}</dt><dd>{x.v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
