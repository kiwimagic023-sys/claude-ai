import { useState } from 'react';
import { eventTypes } from '../config/site';
import { EventForm } from './EventForm';

export function Events() {
  const [open, setOpen] = useState(false);
  return (
    <section id="eventos" className="section events" aria-labelledby="events-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Eventos & encomendas</p>
          <h2 id="events-title" className="section-title">Poison Donuts nos seus <span className="text-gradient">eventos</span></h2>
          <p className="section-lead">Leve a experiência Poison Donuts para festas, eventos, empresas e momentos especiais.</p>
        </header>
        <div className="events__grid">
          {eventTypes.map((e, i) => (
            <article key={e.title} className="event-card" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="event-card__icon" aria-hidden="true">{e.emoji}</span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </article>
          ))}
        </div>
        <div className="events__cta" data-reveal>
          <button className="btn btn--primary btn--lg" onClick={() => setOpen(true)}>Quero levar a Poison para meu evento</button>
        </div>
      </div>
      <EventForm open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
