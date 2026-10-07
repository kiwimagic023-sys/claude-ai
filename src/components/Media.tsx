import type { DonutArt, MediaSource } from '../config/site';
import { Donut } from './Donut';

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

interface Props {
  src?: MediaSource;
  art?: DonutArt;
  seed: string;
  alt: string;
  className?: string;
  /** imagens acima da dobra devem carregar imediatamente */
  eager?: boolean;
}

/**
 * Mostra a foto/vídeo configurado (src) ou, se não houver, a ilustração do donut.
 * Aceita imagens estáticas e animadas (jpg, png, webp, gif, avif) e vídeos curtos (mp4, webm).
 */
export function Media({ src, art, seed, alt, className, eager }: Props) {
  if (src && typeof src === 'object') {
    return (
      <video className={className} poster={src.poster} autoPlay muted loop playsInline preload={eager ? 'auto' : 'metadata'} aria-label={alt}>
        {src.webm && <source src={src.webm} type="video/webm" />}
        <source src={src.mp4} type="video/mp4" />
      </video>
    );
  }
  if (src && isVideo(src)) {
    return <video className={className} src={src} autoPlay muted loop playsInline preload={eager ? 'auto' : 'metadata'} aria-label={alt} />;
  }
  if (src) {
    return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
  }
  return <Donut art={art ?? { glaze: '#ff2fb3', topping: 'sprinkles' }} seed={seed} title={alt} className={className} />;
}
