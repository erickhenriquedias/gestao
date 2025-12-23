import React from 'react';
import { Plus, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatPercentage, renderPriceOrOff } from '../../utils/formatters';

const TransactionForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    categories,
    goals,
    marketData,
    cryptoData,
    handleAssetSelect
}) => {
    return (
        <Card className="p-6 no-print w-full" id="input-section">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Plus size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Novo Lançamento Rápido</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1"><Select label="Tipo" name="type" value={formData.type} onChange={handleInputChange}><option value="expense">Saída (-)</option><option value="income">Entrada (+)</option></Select></div>
                    <div className="md:col-span-1"><Select label="Categoria" name="category" value={formData.category} onChange={handleInputChange}>{categories.filter(c => c.type === formData.type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
                    <div className="md:col-span-1"><Input label="Data" type="date" name="date" value={formData.date} onChange={handleInputChange} required /></div>
                </div>
                {(formData.category === 'investment' || formData.category === 'crypto') && formData.type === 'expense' ? (
                    <div className="col-span-full mb-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Cotações em Tempo Real (Clique para Selecionar)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                            {(formData.category === 'crypto' ? cryptoData : marketData).map((asset) => (
                                <div key={asset.ticker} onClick={() => handleAssetSelect(asset)} className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.ticker === asset.ticker ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300'}`}>
                                    <div className="flex justify-between items-start"><span className="font-bold text-sm text-slate-700 dark:text-slate-200">{asset.ticker}</span><span className={`text-[10px] font-bold ${asset.variation >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatPercentage(asset.variation)}</span></div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{asset.name}</div>
                                    <div className="font-bold text-slate-800 dark:text-white mt-1">{renderPriceOrOff(asset.price)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3">
                            <Input label="Código do Ativo (Ticker) - Para ativos fora da lista" placeholder="Ex: DIS, MGLU3, HASH11" name="ticker" value={formData.ticker} onChange={handleInputChange} />
                        </div>
                    </div>
                ) : (<div className="md:col-span-2"><Input label="Descrição" placeholder="Ex: Aluguel, Mercado" name="description" value={formData.description} onChange={handleInputChange} required /></div>)}

                {formData.category === 'goals_contribution' && (
                    <div className="md:col-span-3">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Selecione a Meta</label>
                        <select
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 appearance-none"
                            name="goalId"
                            value={formData.goalId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    {(formData.category !== 'investment' && formData.category !== 'crypto') && (<div className="hidden"></div>)}
                    <div className={(formData.category === 'investment' || formData.category === 'crypto') ? "md:col-span-2" : "md:col-span-2"}><div className="flex gap-2"><div className="w-1/3"><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Moeda</label><div className="relative"><select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 appearance-none" name="currency" value={formData.currency} onChange={handleInputChange}><option value="BRL">BRL (R$)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div></div><div className="flex-1"><Input label="Valor" type="number" step="0.01" placeholder="0,00" name="amount" value={formData.amount} onChange={handleInputChange} required /></div></div></div>
                </div>
                {(formData.category === 'investment' || formData.category === 'crypto') && formData.ticker && (<div className="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 p-3 rounded-lg text-sm flex items-start gap-2 border border-sky-100 dark:border-sky-800"><Zap size={16} className="mt-0.5 shrink-0" /><div><strong>Ativo Selecionado: {formData.ticker}</strong><br />O sistema usará o preço atual para calcular a quantidade automaticamente.</div></div>)}
                <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="recurrence" name="isRecurring" checked={formData.isRecurring} onChange={handleInputChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><label htmlFor="recurrence" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Repetir este lançamento mensalmente?</label>{formData.isRecurring && (<select name="recurrenceCount" value={formData.recurrenceCount} onChange={handleInputChange} className="text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-1 ml-2 text-slate-700 dark:text-slate-300"><option value="6">6 meses</option><option value="12">12 meses</option><option value="24">24 meses</option></select>)}</div>
                <Button type="submit" className="w-full h-12 text-lg"><Plus size={20} /> Adicionar</Button>
            </form>
        </Card>
    );
};

export default TransactionForm;
