import React from 'react';
import { Target, Trash2, CalendarClock, Trophy } from 'lucide-react';
import Card from '../ui/Card';
import CategoryIcon from '../ui/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';
import { calculateMonthsDiff } from '../../utils/date';

const GoalList = ({ goals, handleDeleteGoal }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-white mb-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="text-emerald-300" /> Metas Financeiras
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const monthsLeft = calculateMonthsDiff(new Date(), new Date(goal.deadline));
                    const monthlySuggestion = monthsLeft > 0 ? remaining / monthsLeft : remaining;

                    return (
                        <Card key={goal.id} className="p-5 flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className="p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors dark:bg-slate-800 dark:hover:bg-rose-900/30"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        <CategoryIcon iconName={goal.icon || 'Target'} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{goal.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Alvo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Progresso</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(progress, 100)}%` }} />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                                    <span>{formatCurrency(goal.currentAmount)}</span>
                                    <span>{formatCurrency(goal.targetAmount)}</span>
                                </div>
                            </div>
                            {remaining > 0 ? (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CalendarClock size={14} className="text-indigo-500" />
                                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Planejamento</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        Faltam <strong>{formatCurrency(remaining)}</strong>.
                                        {monthsLeft > 0 ? (
                                            <span> Guarde <strong>{formatCurrency(monthlySuggestion)}</strong>/mês por {monthsLeft} meses.</span>
                                        ) : (
                                            <span className="text-rose-500 font-bold ml-1"> O prazo acabou!</span>
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                    <Trophy size={16} /> Meta Atingida! Parabéns!
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalList;
