import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { CAT } from '../utils/helpers';

export default function Charts({ txs, filteredTxs, isDark }) {
  const lineCanvasRef = useRef(null);
  const donutCanvasRef = useRef(null);
  const lineChartInstance = useRef(null);
  const donutChartInstance = useRef(null);

  useEffect(() => {
    if (!lineCanvasRef.current || !donutCanvasRef.current) return;

    // Destruir instâncias antigas antes de renderizar novas
    if (lineChartInstance.current) lineChartInstance.current.destroy();
    if (donutChartInstance.current) donutChartInstance.current.destroy();

    // --- LÓGICA DO GRÁFICO DE LINHA ---
    const byMonth = {};
    txs.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
      if (t.type === 'income') byMonth[key].income += t.amount;
      else byMonth[key].expense += t.amount;
    });

    const months = Object.keys(byMonth).sort().slice(-6);
    const lineLabels = months.map((m) => {
      const [y, mo] = m.split('-');
      return new Date(+y, +mo - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    });

    const incData = months.map((m) => Math.round(byMonth[m].income));
    const expData = months.map((m) => Math.round(byMonth[m].expense));

    lineChartInstance.current = new Chart(lineCanvasRef.current, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: 'Receitas',
            data: incData,
            borderColor: '#3ddc97',
            backgroundColor: 'rgba(61,220,151,0.12)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#3ddc97',
            borderWidth: 2,
          },
          {
            label: 'Despesas',
            data: expData,
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255,107,107,0.10)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#ff6b6b',
            borderWidth: 2,
            borderDash: [5, 4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: '#7a7a90', font: { size: 11, family: "'DM Sans', sans-serif" } },
          },
          y: {
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { color: '#7a7a90', font: { size: 11, family: "'DM Sans', sans-serif" } },
          },
        },
      },
    });

    // --- LÓGICA DO GRÁFICO DE ROSCA ---
    const byCat = {};
    filteredTxs.filter((t) => t.type === 'expense').forEach((t) => {
      byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
    });

    const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const donutLabels = entries.map(([c]) => c.charAt(0).toUpperCase() + c.slice(1));
    const values = entries.map(([, v]) => v);
    const colors = entries.map(([c]) => (CAT[c] || CAT.outros).color);

    donutChartInstance.current = new Chart(donutCanvasRef.current, {
      type: 'doughnut',
      data: {
        labels: donutLabels,
        datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: { legend: { display: false } },
      },
    });

    return () => {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
    };
  }, [txs, filteredTxs, isDark]);

  // Função para renderizar a legenda do gráfico de rosca
  const renderDonutLegend = () => {
    const byCat = {};
    filteredTxs.filter((t) => t.type === 'expense').forEach((t) => {
      byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
    });

    const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((acc, [, val]) => acc + val, 0) || 1;

    return entries.slice(0, 5).map(([cat, val]) => {
      const c = CAT[cat] || CAT.outros;
      const pct = Math.round((val / total) * 100);
      return (
        <div key={cat} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
          <div className="text-[#7a7a90] flex-1">{c.icon} {cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
          <div className="font-medium text-[#f0f0f5]">{pct}%</div>
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6">
        <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-4">Evolução mensal</div>
        <div className="relative h-[220px]">
          <canvas ref={lineCanvasRef} />
        </div>
      </div>
      <div className="bg-white dark:bg-[#17171d] border border-[#e0e0ec] dark:border-[#2a2a36] rounded-3xl p-6">
        <div className="uppercase text-xs tracking-widest text-[#7a7a90] mb-4">Despesas por categoria</div>
        <div className="relative h-[220px]">
          <canvas ref={donutCanvasRef} />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {renderDonutLegend()}
        </div>
      </div>
    </div>
  );
}