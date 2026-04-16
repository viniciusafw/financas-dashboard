'use client';

import React, { useState, useEffect } from 'react';
import { getSeedData, formatCurrency } from './utils/helpers';
import Charts from './components/Charts';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

export default function App() {
  const [txs, setTxs] = useState([]);
  const [monthFilter, setMonthFilter] = useState('all');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const saved = localStorage.getItem('ft_txs');
    if (saved) {
      try {
        setTxs(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar dados salvos', e);
      }
    } else {
      const seed = getSeedData();
      setTxs(seed);
      localStorage.setItem('ft_txs', JSON.stringify(seed));
    }
  }, []);

  const saveTransactions = (newTxs) => {
    localStorage.setItem('ft_txs', JSON.stringify(newTxs));
    setTxs(newTxs);
  };

  const handleAddTx = (newTx) => {
    saveTransactions([...txs, newTx]);
  };

  const handleDeleteTx = (id) => {
    const newTxs = txs.filter((tx) => tx.id !== id);
    saveTransactions(newTxs);
  };

  const clearAll = () => {
    if (confirm('Apagar todas as transações e reiniciar com dados de exemplo?')) {
      localStorage.removeItem('ft_txs');
      const seed = getSeedData();
      setTxs(seed);
      localStorage.setItem('ft_txs', JSON.stringify(seed));
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Cálculos do Painel
  const filteredTxs = txs.filter((tx) => monthFilter === 'all' || tx.date.startsWith(monthFilter));
  const income = filteredTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = filteredTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;
  const availableMonths = [...new Set(txs.map((t) => t.date.slice(0, 7)))].sort().reverse();

  return (
    <div className="min-h-screen bg-[#f4f4f8] dark:bg-[#0f0f13] text-[#111118] dark:text-[#f0f0f5] font-sans transition-colors">
      <div className="max-w-[900px] mx-auto px-5 py-8 pb-16">
        
        {/* TOPBAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="font-mono text-xl tracking-[-0.5px]">
            fin<span className="text-[#3ddc97]">.</span>track
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] text-[#111118] dark:text-[#f0f0f5] text-sm px-4 py-2 rounded-2xl cursor-pointer focus:outline-none focus:border-[#3ddc97]"
            >
              <option value="all">Todos os meses</option>
              {availableMonths.map((m) => {
                const [y, mo] = m.split('-');
                const label = new Date(+y, +mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                return <option key={m} value={m}>{label}</option>;
              })}
            </select>

            <button onClick={toggleTheme} title="Alternar tema" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] text-[#7a7a90] hover:text-[#f0f0f5] rounded-2xl text-2xl transition-colors">
              {isDark ? '☀️' : '🌙'}
            </button>

            <button onClick={clearAll} className="px-5 py-2 text-sm border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl hover:bg-white dark:hover:bg-[#17171d] transition-colors">
              Limpar
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#3ddc97]" />
            <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-2">Receitas</div>
            <div className="font-mono text-3xl font-bold text-[#3ddc97]">{formatCurrency(income)}</div>
          </div>
          <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff6b6b]" />
            <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-2">Despesas</div>
            <div className="font-mono text-3xl font-bold text-[#ff6b6b]">{formatCurrency(expense)}</div>
          </div>
          <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#60a5fa]" />
            <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-2">Saldo</div>
            <div className={`font-mono text-3xl font-bold ${balance >= 0 ? 'text-[#60a5fa]' : 'text-[#ff6b6b]'}`}>
              {formatCurrency(balance)}
            </div>
          </div>
          <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#a78bfa]" />
            <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-2">Transações</div>
            <div className="font-mono text-3xl font-bold text-[#a78bfa]">{filteredTxs.length}</div>
          </div>
        </div>

        {/* COMPONENTES FILHOS */}
        <Charts txs={txs} filteredTxs={filteredTxs} isDark={isDark} />
        
        <TransactionList filteredTxs={filteredTxs} onDelete={handleDeleteTx} />
        
        <TransactionForm onAdd={handleAddTx} />
        
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 9999px; }
      `}</style>
    </div>
  );
}