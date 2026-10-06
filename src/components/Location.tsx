import { useEffect, useState } from 'react';
import { hours, links, store } from '../config/site';
import { formatRange, getOpenStatus, storeDay } from '../lib/hours';
import { IconClock, IconPhone, IconPin } from './Icons';

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`Poison Donuts, ${store.address.street}, ${store.address.neighborhood}, ${store.address.city}`)}&z=16&output=embed`;

export const useOpenStatus = () => {
  const [status, setStatus] = useState(getOpenStatus);
  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
};

export function Location() {
  const status = useOpenStatus();
  const today = storeDay();
  const { address } = store;

  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Localização</p>
          <h2 id="location-title" className="section-title">Venha nos <span className="text-gradient">visitar</span></h2>
        </header>
        <div className="location__grid" data-reveal>
          <div className="location__card">
            <span className={`status ${status.open ? 'status--open' : 'status--closed'}`}>
              <span className="status__dot" /> {status.label} <small>· {status.detail}</small>
            </span>
            <h3>{address.venue}</h3>
            <address>
              <IconPin />
              <span>{address.street}<br />{address.neighborhood}<br />{address.city} - {address.state}<br />{address.zip}</span>
            </address>
            <a className="location__phone" href={`tel:+${store.phoneE164}`}><IconPhone /> {store.phoneDisplay}</a>
            <div className="hours">
              <h4><IconClock width={18} height={18} /> Horário de funcionamento</h4>
              <ul>
                {hours.map((h) => (
                  <li key={h.day} className={h.day === today ? 'is-today' : ''}>
                    <span>{h.label}</span><span>{formatRange(h.open, h.close)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="location__ctas">
              <a className="btn btn--primary btn--block" href={links.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin width={20} height={20} /> Como chegar</a>
              <a className="btn btn--ghost btn--block" href={`tel:+${store.phoneE164}`}><IconPhone width={20} height={20} /> Ligar</a>
            </div>
          </div>
          <div className="location__map">
            <iframe title="Mapa: Poison Donuts no Barra Shopping" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}
