const features = [
  { icon: '🍩', title: 'Donuts gigantes', text: 'Donuts grandes, recheados e preparados para impressionar.', tone: 'pink' },
  { icon: '🚀', title: 'Sabores irresistíveis', text: 'Combinações criativas para todos os gostos.', tone: 'blue' },
  { icon: '✨', title: 'Ingredientes de qualidade', text: 'Produtos preparados com cuidado e atenção aos detalhes.', tone: 'yellow' },
  { icon: '💜', title: 'Experiência Poison', text: 'Muito mais que um donut: uma experiência.', tone: 'purple' },
];

export function Features() {
  return (
    <section id="por-que" className="section features" aria-labelledby="features-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Por que Poison Donuts?</p>
          <h2 id="features-title" className="section-title">Feitos para <span className="text-gradient">viciar</span> (no bom sentido)</h2>
        </header>
        <div className="features__grid">
          {features.map((f, i) => (
            <article key={f.title} className={`feature-card tone-${f.tone}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
