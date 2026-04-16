export const CAT = {
  alimentação: { icon: '🍽', color: '#3ddc97' },
  lazer: { icon: '🎮', color: '#60a5fa' },
  contas: { icon: '💡', color: '#fbbf24' },
  saúde: { icon: '💊', color: '#ff6b6b' },
  transporte: { icon: '🚌', color: '#a78bfa' },
  outros: { icon: '📦', color: '#94a3b8' },
  receita: { icon: '💰', color: '#2dd4bf' },
};

export const formatCurrency = (value) => {
  return `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getSeedData = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const pm = String(now.getMonth() === 0 ? 12 : now.getMonth()).padStart(2, '0');
  const py = now.getMonth() === 0 ? y - 1 : y;

  return [
    { id: 1, desc: 'Salário', amount: 4500, type: 'income', cat: 'receita', date: `${y}-${m}-01` },
    { id: 2, desc: 'Aluguel', amount: 1200, type: 'expense', cat: 'contas', date: `${y}-${m}-05` },
    { id: 3, desc: 'Supermercado', amount: 380, type: 'expense', cat: 'alimentação', date: `${y}-${m}-07` },
    { id: 4, desc: 'Netflix', amount: 45, type: 'expense', cat: 'lazer', date: `${y}-${m}-10` },
    { id: 5, desc: 'Farmácia', amount: 95, type: 'expense', cat: 'saúde', date: `${y}-${m}-12` },
    { id: 6, desc: 'Uber', amount: 62, type: 'expense', cat: 'transporte', date: `${y}-${m}-14` },
    { id: 7, desc: 'Restaurante', amount: 150, type: 'expense', cat: 'alimentação', date: `${y}-${m}-16` },
    { id: 8, desc: 'Freelance', amount: 800, type: 'income', cat: 'receita', date: `${y}-${m}-18` },
    { id: 9, desc: 'Academia', amount: 120, type: 'expense', cat: 'saúde', date: `${y}-${m}-20` },
    { id: 10, desc: 'Salário', amount: 4500, type: 'income', cat: 'receita', date: `${py}-${pm}-01` },
    { id: 11, desc: 'Aluguel', amount: 1200, type: 'expense', cat: 'contas', date: `${py}-${pm}-05` },
    { id: 12, desc: 'Supermercado', amount: 420, type: 'expense', cat: 'alimentação', date: `${py}-${pm}-08` },
    { id: 13, desc: 'Show de música', amount: 200, type: 'expense', cat: 'lazer', date: `${py}-${pm}-15` },
  ];
};