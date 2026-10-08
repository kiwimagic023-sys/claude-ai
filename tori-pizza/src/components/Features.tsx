import { features } from '../config/site';

export function Features() {
  return (
    <section className="features" aria-label="Destaques">
      <ul className="container features__grid">
        {features.map((f, i) => (
          <li key={f.title} className="feature" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
            <span className="feature__emoji" aria-hidden="true">{f.emoji}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
