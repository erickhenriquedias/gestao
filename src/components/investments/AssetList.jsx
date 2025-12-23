import React from 'react';
import { Bitcoin, Briefcase } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency, formatCurrencyUnit, formatPercentage, renderPriceOrOff } from '../../utils/formatters';

const AssetList = ({
    view,
    financialSummary,
    marketData,
    cryptoData,
    assetSummary,
    groupByAsset,
    setGroupByAsset,
    getCurrentPrice,
    renderTrend
}) => {
    return (
        <div className="space-y-6 no-print">
            <Card className={`p-6 border-none text-white ${view === 'investments' ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gradient-to-br from-orange-500 to-amber-600'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">{view === 'investments' ? <Briefcase size={24} /> : <Bitcoin size={24} />}</div>
                    <h3 className="font-bold text-lg">Minha Carteira</h3>
                </div>
                <div className="mb-4">
                    <p className="opacity-80 text-xs uppercase tracking-wider">Saldo Atual (Mercado)</p>
                    <h2 className="text-3xl font-bold">{formatCurrency(view === 'investments' ? financialSummary.investmentCurrentValue : financialSummary.cryptoCurrentValue)}</h2>
                </div>
                <div className="bg-white/10 rounded p-2 mb-4">
                    <p className="opacity-80 text-xs">Total Investido</p>
                    <p className="font-semibold">{formatCurrency(view === 'investments' ? financialSummary.investmentCost : financialSummary.cryptoCost)}</p>
                </div>
            </Card>

            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cotações em Tempo Real</h3>
                {(view === 'investments' ? marketData : cryptoData).map((item) => (
                    <div key={item.ticker} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${item.variation > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : (item.variation < 0 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500')}`}>
                                {renderTrend(item.variation)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-200 text-lg">{item.ticker}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.name}</p>
                            </div>
                        </div>

                        {/* Extra Crypto Info */}
                        {view === 'crypto' && item.marketCap && (
                            <div className="hidden sm:flex flex-col text-right text-xs text-slate-500 gap-1 border-l border-slate-200 dark:border-slate-700 pl-4">
                                <div><span className="opacity-70">Cap. Mercado:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrencyUnit(item.marketCap)}</span></div>
                                <div><span className="opacity-70">Vol. 24h:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrencyUnit(item.volume24h)}</span></div>
                            </div>
                        )}

                        {/* Extra Stock Info */}
                        {view === 'investments' && (
                            <div className="hidden sm:flex flex-col text-right text-xs text-slate-500 gap-1 border-l border-slate-200 dark:border-slate-700 pl-4 w-32">
                                <div><span className="opacity-70">Setor:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{item.sector}</span></div>
                                {item.dividendYield > 0 && <div><span className="opacity-70">DY Anual:</span> <span className="font-medium text-emerald-600">{item.dividendYield}%</span></div>}
                            </div>
                        )}

                        <div className="flex justify-between sm:block text-right">
                            <div className="sm:hidden text-xs text-slate-500 font-medium self-center">Preço Atual (USD/BRL)</div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-lg">{renderPriceOrOff(item.price)}</p>
                                <p className={`text-xs font-bold ${item.variation > 0 ? 'text-emerald-600 dark:text-emerald-400' : (item.variation < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500')}`}>
                                    {formatPercentage(item.variation)} {view === 'crypto' && <span className="opacity-60 text-[10px] ml-1">24h</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">Meus Ativos</h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setGroupByAsset(true)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${groupByAsset ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Resumo</button>
                        <button onClick={() => setGroupByAsset(false)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!groupByAsset ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>Detalhes</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-3 px-2">Ativo</th>
                                <th className="py-3 px-2 text-right">Qtd</th>
                                <th className="py-3 px-2 text-right">PM (R$)</th>
                                <th className="py-3 px-2 text-right">Preço Atual</th>
                                <th className="py-3 px-2 text-right">Saldo</th>
                                <th className="py-3 px-2 text-right">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assetSummary.map((t, idx) => {
                                const currentPrice = getCurrentPrice(t.ticker, view === 'investments' ? 'investment' : 'crypto');
                                const priceForCalc = currentPrice || 0;
                                const currentValue = (t.quantity && priceForCalc) ? t.quantity * priceForCalc : (currentPrice === null ? t.amount : 0);
                                const avgPrice = t.quantity > 0 ? t.amount / t.quantity : 0;
                                const profit = currentPrice !== null ? currentValue - t.amount : 0;
                                const profitPercent = (currentPrice !== null && avgPrice > 0) ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;

                                return (
                                    <tr key={groupByAsset ? idx : t.id} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-2 font-medium">{t.ticker || t.description}</td>
                                        <td className="py-3 px-2 text-right font-mono">{t.quantity ? parseFloat(t.quantity).toFixed(4) : '-'}</td>
                                        <td className="py-3 px-2 text-right">{formatCurrencyUnit(avgPrice)}</td>
                                        <td className="py-3 px-2 text-right font-bold">{renderPriceOrOff(currentPrice)}</td>
                                        <td className="py-3 px-2 text-right font-bold">{currentPrice !== null ? formatCurrency(currentValue) : <span className="text-slate-400">---</span>}</td>
                                        <td className={`py-3 px-2 text-right font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{currentPrice !== null ? (<div className="flex flex-col items-end"><span className="text-xs">{formatPercentage(profitPercent)}</span><span>{formatCurrency(profit)}</span></div>) : <span className="text-slate-400">OFF</span>}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AssetList;
