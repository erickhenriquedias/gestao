import React from 'react';
import { PiggyBank } from 'lucide-react';
import Card from '../ui/Card';
import CategoryIcon from '../ui/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';

const BudgetList = ({ categories, categorySpending, handleUpdateBudget, getProgressBarColor }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-white mb-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <PiggyBank className="text-emerald-300" /> Orçamentos do Mês
                </h2>
            </div>
            <Card className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6">Defina tetos de gastos para suas categorias e acompanhe o progresso em tempo real (em BRL).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.filter(c => c.type === 'expense').map(cat => {
                        const spent = categorySpending[cat.id] || 0;
                        const budget = cat.budget || 0;
                        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                        const remaining = budget - spent;
                        const progressColor = getProgressBarColor(spent, budget);

                        return (
                            <div key={cat.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg text-white" style={{ backgroundColor: cat.color }}>
                                            <CategoryIcon iconName={cat.icon} size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200">{cat.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Gasto: {formatCurrency(spent)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <input
                                            type="number"
                                            className="w-24 text-right bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 font-bold text-slate-800 dark:text-white"
                                            value={budget}
                                            onChange={(e) => handleUpdateBudget(cat.id, e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Meta</p>
                                    </div>
                                </div>
                                <div className="relative h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className={`${percentage > 100 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>{percentage.toFixed(0)}% utilizado</span>
                                    <span className={`${remaining < 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{remaining >= 0 ? `Resta ${formatCurrency(remaining)}` : `Estourou ${formatCurrency(Math.abs(remaining))}`}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default BudgetList;
