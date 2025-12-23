import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, CalendarClock, Zap, Target } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

const SummaryCards = ({ financialSummary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-l-4 border-l-emerald-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Entradas</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(financialSummary.income)}</h3>
                    </div>
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                        <ArrowUpCircle size={24} />
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><CalendarClock size={12} /> A Receber</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(financialSummary.pendingIncome)}</span>
                    </div>
                    <div className="flex justify-between bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                        <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-medium"><Zap size={10} /> Renda Passiva (Est.)</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">+{formatCurrency(financialSummary.projectedMonthlyIncome)}</span>
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-rose-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saídas</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(financialSummary.expenses)}</h3>
                    </div>
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400">
                        <ArrowDownCircle size={24} />
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10 text-xs flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><CalendarClock size={12} /> A Pagar</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(financialSummary.pendingExpenses)}</span>
                </div>
            </Card>

            <Card className={`p-6 border-l-4 ${financialSummary.balance >= 0 ? 'border-l-indigo-500' : 'border-l-red-500'} relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saldo Atual</p>
                        <h3 className={`text-2xl font-bold ${financialSummary.balance >= 0 ? 'text-indigo-900 dark:text-indigo-300' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(financialSummary.balance)}</h3>
                    </div>
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10 text-xs flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Target size={12} /> Projetado</span>
                    <span className={`font-bold ${financialSummary.projectedBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(financialSummary.projectedBalance)}</span>
                </div>
            </Card>
        </div>
    );
};

export default SummaryCards;
