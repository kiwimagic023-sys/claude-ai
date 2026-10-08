import { useEffect, useState } from 'react';
import { getOpenStatus } from '../lib/hours';

/** "Aberto/Fechado" atualizado a cada minuto */
export const useOpenStatus = () => {
  const [status, setStatus] = useState(getOpenStatus);
  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return status;
};
