import React from 'react';
import { Trash2, Edit2, CalendarDays, CreditCard } from 'lucide-react';
import Card from '../ui/Card';
import CategoryIcon from '../ui/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';

const SubscriptionList = ({
    subscriptions,
    categories,
    onEdit,
    onDelete
}) => {
    const totalMonthly = subscriptions.reduce((acc, sub) => acc + Number(sub.amount), 0);

    const getCategoryDetails = (id) => categories.find(c => c.id === id) || { name: 'Geral', color: '#cbd5e1', icon: 'Box' };

    // Sort by billing day
    const sortedSubs = [...subscriptions].sort((a, b) => Number(a.billingDay) - Number(b.billingDay));

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-emerald-600 text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-emerald-100 font-medium mb-1">Custo Fixo Mensal</h3>
                        <div className="text-3xl font-bold">{formatCurrency(totalMonthly)}</div>
                    </div>
                    <div className="mt-4 text-emerald-100 text-sm">
                        {subscriptions.length} assinaturas ativas
                    </div>
                </Card>
                <Card className="p-6 flex items-center justify-center text-center text-slate-500 dark:text-slate-400">
                    <div>
                        <p>💡 Dica: Mantenha suas assinaturas atualizadas para prever seu fluxo de caixa.</p>
                    </div>
                </Card>
            </div>

            {/* List */}
            <Card className="p-6">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg mb-4">Minhas Assinaturas</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-3 px-2 text-slate-500 dark:text-slate-400">Dia</th>
                                <th className="py-3 px-2 text-slate-500 dark:text-slate-400">Serviço</th>
                                <th className="py-3 px-2 text-slate-500 dark:text-slate-400">Categoria</th>
                                <th className="py-3 px-2 text-right text-slate-500 dark:text-slate-400">Valor</th>
                                <th className="py-3 px-2 text-center text-slate-500 dark:text-slate-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSubs.length > 0 ? (
                                sortedSubs.map((sub) => {
                                    const cat = getCategoryDetails(sub.category);
                                    return (
                                        <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="py-3 px-2 font-bold text-slate-600 dark:text-slate-300">
                                                {sub.billingDay}
                                            </td>
                                            <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-200">
                                                {sub.name}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                                    <CategoryIcon iconName={cat.icon} size={12} />
                                                    {cat.name}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right font-bold text-slate-700 dark:text-slate-200">
                                                {formatCurrency(sub.amount)}
                                            </td>
                                            <td className="py-3 px-2 text-center flex items-center justify-center gap-2">
                                                <button onClick={() => onEdit(sub)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => onDelete(sub.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500">
                                        Nenhuma assinatura cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SubscriptionList;
