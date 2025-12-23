import React, { useState } from 'react';
import {
    PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart, BarChart3, BarChart2, Eye, EyeOff, Calendar, CalendarDays, CalendarClock, ListFilter } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

const ChartSection = ({
    chartData,
    activeChartCategories,
    hiddenCategories,
    toggleCategoryVisibility,
    chartType,
    setChartType,
    chartPeriod,
    setChartPeriod,
    darkMode
}) => {
    const [visualType, setVisualType] = useState('pie'); // 'pie', 'bar', 'column'

    return (
        <Card className="p-6 w-full">
            <div className="flex flex-col mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {visualType === 'pie' && <PieChart size={20} className="text-emerald-500" />}
                        {visualType === 'bar' && <BarChart3 size={20} className="text-emerald-500" />}
                        {visualType === 'column' && <BarChart2 size={20} className="text-emerald-500" />}
                        <h3 className="font-bold text-slate-700 dark:text-slate-200">Análise Visual</h3>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setVisualType('pie')} className={`p-1.5 rounded-md transition-all ${visualType === 'pie' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-400'}`} title="Gráfico de Pizza"><PieChart size={16} /></button>
                        <button onClick={() => setVisualType('bar')} className={`p-1.5 rounded-md transition-all ${visualType === 'bar' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-400'}`} title="Barras Laterais"><BarChart3 size={16} /></button>
                        <button onClick={() => setVisualType('column')} className={`p-1.5 rounded-md transition-all ${visualType === 'column' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-400'}`} title="Colunas"><BarChart2 size={16} /></button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                    {activeChartCategories.map(cat => (
                        <button key={cat.id} onClick={() => toggleCategoryVisibility(cat.id)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${hiddenCategories.includes(cat.id) ? 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 shadow-sm'}`} style={{ borderColor: hiddenCategories.includes(cat.id) ? undefined : cat.color, color: hiddenCategories.includes(cat.id) ? undefined : cat.color }}>
                            <span className={`w-2 h-2 rounded-full ${hiddenCategories.includes(cat.id) ? 'bg-slate-300' : ''}`} style={{ backgroundColor: hiddenCategories.includes(cat.id) ? undefined : cat.color }}></span>
                            {cat.name}
                            {hiddenCategories.includes(cat.id) ? <EyeOff size={10} /> : <Eye size={10} />}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
                        <button onClick={() => setChartType('expense')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'expense' ? 'bg-white dark:bg-slate-600 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>Despesas</button>
                        <button onClick={() => setChartType('income')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'income' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>Receitas</button>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto custom-scrollbar">
                        <button onClick={() => setChartPeriod('month')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${chartPeriod === 'month' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Mês</button>
                        <button onClick={() => setChartPeriod('last3')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${chartPeriod === 'last3' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>3 Meses</button>
                        <button onClick={() => setChartPeriod('last6')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${chartPeriod === 'last6' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>6 Meses</button>
                        <button onClick={() => setChartPeriod('year')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${chartPeriod === 'year' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Ano</button>
                        <button onClick={() => setChartPeriod('all')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${chartPeriod === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Tudo</button>
                    </div>
                </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center relative">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {visualType === 'pie' && (
                            <RePieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke={darkMode ? "#1e293b" : "#fff"}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${formatCurrency(value)} (${props.payload.percent ? Number(props.payload.percent).toFixed(1) : 0}%)`, name]} contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#fff' : '#000' }} />
                                <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => `${value} (${entry.payload.percent ? Number(entry.payload.percent).toFixed(1) : 0}%)`} />
                            </RePieChart>
                        )}
                        {visualType === 'bar' && (
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} />
                                <Tooltip cursor={{ fill: darkMode ? '#334155' : '#f1f5f9', opacity: 0.4 }} formatter={(value) => [formatCurrency(value), 'Valor']} contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#fff' : '#000' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        )}
                        {visualType === 'column' && (
                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis dataKey="name" interval={0} tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }} angle={-15} textAnchor="end" />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: darkMode ? '#334155' : '#f1f5f9', opacity: 0.4 }} formatter={(value) => [formatCurrency(value), 'Valor']} contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#fff' : '#000' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <PieChart size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">Sem dados para exibir</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ChartSection;
