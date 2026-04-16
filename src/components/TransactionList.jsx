import React, { useState } from 'react';
import { CAT, formatCurrency } from '../utils/helpers';

export default function TransactionList({ filteredTxs, onDelete }) {
  const [filter, setFilter] = useState('todas');

  const renderBars = () => {
    const expenses = filteredTxs.filter((t) => t.type === 'expense');
    const byCat = {};
    expenses.forEach((t) => {
      byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
    });
    
    const total = Object.values(byCat).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

    if (!sorted.length) return <div className="text-center py-10 text-[#7a7a90]">Sem despesas no período</div>;

    return sorted.map(([cat, val]) => {
      const pct = Math.round((val / total) * 100);
      const c = CAT[cat] || CAT.outros;
      return (
        <div key={cat} className="flex items-center gap-3 mb-3">
          <div className="font-medium text-[#7a7a90] w-[110px] text-sm truncate">
            {c.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </div>
          <div className="flex-1 h-2 bg-[#f0f0f6] dark:bg-[#1e1e26] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} />
          </div>
          <div className="text-[#7a7a90] text-xs w-9 text-right">{pct}%</div>
          <div className="font-mono text-[#111118] dark:text-[#f0f0f5] text-xs w-20 text-right">{formatCurrency(val)}</div>
        </div>
      );
    });
  };

  const renderList = () => {
    const filtered = filteredTxs.filter((t) => {
      if (filter === 'todas') return true;
      if (filter === 'receita') return t.type === 'income';
      return t.cat === filter;
    });
    
    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!sorted.length) return <div className="text-center py-12 text-[#7a7a90]">Nenhuma transação encontrada</div>;

    return sorted.map((t) => {
      const catKey = t.type === 'income' ? 'receita' : t.cat;
      const c = CAT[catKey] || CAT.outros;
      const d = new Date(t.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      const sign = t.type === 'income' ? '+' : '-';
      const amountClass = t.type === 'income' ? 'text-[#3ddc97]' : 'text-[#ff6b6b]';

      return (
        <div key={t.id} className="flex items-center gap-3 bg-[#f0f0f6] dark:bg-[#1e1e26] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-xl p-3.5 hover:border-[#7a7a90] transition-colors">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${c.color}22` }}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#111118] dark:text-[#f0f0f5] text-sm truncate">{t.desc}</div>
            <div className="text-[#7a7a90] text-xs mt-0.5">{d} · {catKey.charAt(0).toUpperCase() + catKey.slice(1)}</div>
          </div>
          <div className={`font-mono text-sm font-semibold ${amountClass}`}>{sign} {formatCurrency(t.amount)}</div>
          <button onClick={() => onDelete(t.id)} className="text-[#7a7a90] hover:text-[#ff6b6b] text-2xl leading-none px-2 transition-colors">×</button>
        </div>
      );
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6 mb-8">
        <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-4">Detalhamento por categoria</div>
        <div className="space-y-1">{renderBars()}</div>
      </div>

      <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6">
        <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-4">Transações</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {['todas', 'alimentação', 'lazer', 'contas', 'saúde', 'transporte', 'receita'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-1.5 text-xs rounded-3xl border transition-all capitalize ${
                filter === cat ? 'bg-[#3ddc97] border-[#3ddc97] text-black font-semibold' : 'border-[#e0e0ec] dark:border-[#2a2a36] hover:border-[#f0f0f5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="max-h-[340px] overflow-y-auto pr-2 space-y-2 custom-scroll">{renderList()}</div>
      </div>
    </>
  );
}