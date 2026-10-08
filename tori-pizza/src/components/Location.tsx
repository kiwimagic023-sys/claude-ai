import { hours, links, store } from '../config/site';
import { useOpenStatus } from '../hooks/useOpenStatus';
import { formatRange, storeDay } from '../lib/hours';
import { IconClock, IconPhone, IconPin } from './Icons';

const { address } = store;
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`Tori pizza, ${address.street}, ${address.city} - ${address.state}`)}&z=16&output=embed`;

export function Location() {
  const status = useOpenStatus();
  const today = storeDay();

  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Localização</p>
          <h2 id="location-title" className="section-title">Venha nos <em>visitar</em></h2>
        </header>
        <div className="location__grid" data-reveal>
          <div className="location__card">
            <span className={`status ${status.open ? 'status--open' : 'status--closed'}`}>
              <span className="status__dot" /> {status.label} <small>· {status.detail}</small>
            </span>
            <address>
              <IconPin />
              <span>{address.street}<br />{address.neighborhood}<br />{address.city} - {address.state}, {address.zip}</span>
            </address>
            <a className="location__phone" href={`tel:+${store.phoneE164}`}><IconPhone /> {store.phoneDisplay}</a>
            <div className="hours">
              <h3><IconClock width={18} height={18} /> Horário de funcionamento</h3>
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
            <iframe title="Mapa: Toripizza em Toritama" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}
