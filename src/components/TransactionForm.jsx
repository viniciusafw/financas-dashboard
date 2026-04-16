import React, { useState, useEffect } from 'react';

export default function TransactionForm({ onAdd }) {
  const [txType, setTxType] = useState('expense');
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCat, setFormCat] = useState('alimentação');
  const [formDate, setFormDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormDate(today);
  }, []);

  const handleTypeChange = (type) => {
    setTxType(type);
    setFormCat(type === 'income' ? 'receita' : 'alimentação');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);

    if (!formDesc.trim() || isNaN(amountVal) || amountVal <= 0 || !formDate) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    onAdd({
      id: Date.now(),
      desc: formDesc.trim(),
      amount: amountVal,
      type: txType,
      cat: txType === 'income' ? 'receita' : formCat,
      date: formDate,
    });

    setFormDesc('');
    setFormAmount('');
  };

  return (
    <div className="mt-8 bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6">
      <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-4">Nova transação</div>

      <div className="inline-flex border border-[#e0e0ec] dark:border-[#2a2a36] rounded-2xl overflow-hidden mb-6">
        <button
          onClick={() => handleTypeChange('expense')}
          className={`px-8 py-3 text-sm font-medium transition-all ${
            txType === 'expense' ? 'bg-[#3d1a1a] text-[#ff6b6b]' : 'bg-transparent text-[#7a7a90]'
          }`}
        >
          Despesa
        </button>
        <button
          onClick={() => handleTypeChange('income')}
          className={`px-8 py-3 text-sm font-medium transition-all ${
            txType === 'income' ? 'bg-[#1a3d2e] text-[#3ddc97]' : 'bg-transparent text-[#7a7a90]'
          }`}
        >
          Receita
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Descrição (ex: Almoço)"
            className="flex-1 bg-[#f0f0f6] dark:bg-[#1e1e26] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-2xl px-5 py-4 text-sm focus:border-[#3ddc97] outline-none placeholder:text-[#7a7a90]"
          />
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            placeholder="Valor R$"
            className="md:w-40 font-mono bg-[#f0f0f6] dark:bg-[#1e1e26] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-2xl px-5 py-4 text-sm focus:border-[#3ddc97] outline-none"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={formCat}
            onChange={(e) => setFormCat(e.target.value)}
            className="md:w-52 bg-[#f0f0f6] dark:bg-[#1e1e26] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-2xl px-5 py-4 text-sm focus:border-[#3ddc97] outline-none capitalize"
          >
            {txType === 'income' ? (
              <option value="receita">Receita</option>
            ) : (
              ['alimentação', 'lazer', 'contas', 'saúde', 'transporte', 'outros'].map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))
            )}
          </select>
          <input
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            className="md:w-52 bg-[#f0f0f6] dark:bg-[#1e1e26] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-2xl px-5 py-4 text-sm focus:border-[#3ddc97] outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-[#3ddc97] hover:bg-[#3ddc97]/90 active:scale-95 transition-all text-black font-mono font-bold py-4 rounded-2xl text-base tracking-wider">
          + ADICIONAR
        </button>
      </form>
    </div>
  );
}