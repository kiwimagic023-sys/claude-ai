const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPrice = (value: number | null): string => (value === null ? 'Consulte' : brl.format(value));
