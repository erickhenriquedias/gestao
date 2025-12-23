import React, { useMemo } from 'react';
import { Trophy, Medal, Star, TrendingUp, Shield, Globe, Target, Wallet, Award, Lock, Zap, Bitcoin, Landmark, DollarSign, Rocket, Share2, UserCheck, Briefcase, Crown, Gem, Repeat, TrendingDown, Divide } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

const AchievementBadge = ({ achievement, onShare }) => {
    const { title, description, icon: Icon, color, isUnlocked, progress, total } = achievement;

    return (
        <Card className={`relative p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 ${isUnlocked ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20' : 'opacity-70 grayscale bg-slate-50 dark:bg-slate-800/50'}`}>
            {!isUnlocked && (
                <div className="absolute top-3 right-3 text-slate-400">
                    <Lock size={16} />
                </div>
            )}
            {isUnlocked && (
                <button
                    onClick={() => onShare(achievement)}
                    className="absolute top-3 right-3 text-emerald-600 hover:text-emerald-800 p-1 rounded-full hover:bg-emerald-100 transition-colors"
                    title="Compartilhar Conquista"
                >
                    <Share2 size={16} />
                </button>
            )}
            <div className={`p-4 rounded-full ${isUnlocked ? color : 'bg-slate-200 dark:bg-slate-700 text-slate-400'} shadow-lg mb-2 relative group`}>
                <Icon size={32} />
                {isUnlocked && <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>}
            </div>

            <div>
                <h3 className={`font-bold ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 h-8">{description}</p>
            </div>

            <div className="w-full mt-2">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-semibold uppercase">
                    <span>Progresso</span>
                    <span>{Math.min(Math.round((progress / total) * 100), 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        style={{ width: `${Math.min((progress / total) * 100, 100)}%` }}
                    />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 text-right">
                    {progress > 1000 ? formatCurrency(progress) : progress} / {total > 1000 ? formatCurrency(total) : total}
                </div>
            </div>

            {isUnlocked && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Star size={8} fill="currentColor" /> CONQUISTADO
                </div>
            )}
        </Card>
    );
};

const Achievements = ({ transactions, goals, financialSummary, userProfile }) => {
    const [shareModal, setShareModal] = React.useState(null);

    const achievementsList = useMemo(() => {
        // Logic to calculate progress
        const totalInvested = financialSummary.investmentCurrentValue + financialSummary.cryptoCurrentValue;
        const savingsCount = transactions.filter(t => t.category === 'investment' || t.category === 'crypto').length;
        const hasForeignCurrency = transactions.some(t => t.currency === 'USD' || t.currency === 'EUR');
        const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

        // Profile Progress
        let profileScore = 0;
        if (userProfile?.nickname || userProfile?.displayName) profileScore++;
        if (userProfile?.profession) profileScore++;
        if (userProfile?.bio) profileScore++;
        if (userProfile?.avatarUrl) profileScore++;
        if (userProfile?.social?.instagram || userProfile?.social?.linkedin || userProfile?.social?.twitter) profileScore++;

        const cryptoCount = transactions.filter(t => t.category === 'crypto').length;
        const stockCount = transactions.filter(t => t.category === 'investment').length;
        const dollarIncome = transactions.some(t => t.type === 'income' && t.currency === 'USD');

        return [
            // --- TIER 1: EASY / INICIANTE ---
            {
                id: 'identity_revealed',
                title: 'Identidade Revelada',
                description: 'Preencha suas informações de perfil (Foto, Bio, Profissão...).',
                icon: UserCheck,
                color: 'bg-pink-100 text-pink-600',
                total: 5,
                progress: profileScore,
                isUnlocked: profileScore >= 4
            },
            {
                id: 'first_goal',
                title: 'Planejador',
                description: 'Crie sua primeira Meta Financeira.',
                icon: Target,
                color: 'bg-lime-100 text-lime-600',
                total: 1,
                progress: goals.length,
                isUnlocked: goals.length >= 1
            },
            {
                id: 'junior_saver',
                title: 'Júnior',
                description: 'Alcance seus primeiros R$ 500,00 de saldo.',
                icon: Wallet,
                color: 'bg-emerald-50 text-emerald-500',
                total: 500,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 500
            },
            {
                id: 'start',
                title: 'Primeiro Passo',
                description: 'Faça seu primeiro registro de investimento ou economia.',
                icon: Zap,
                color: 'bg-yellow-100 text-yellow-600',
                total: 1,
                progress: savingsCount > 0 ? 1 : 0,
                isUnlocked: savingsCount > 0
            },
            {
                id: 'crypto_explorer',
                title: 'Crypto Explorer',
                description: 'Realize seu primeiro investimento em Criptomoedas.',
                icon: Bitcoin,
                color: 'bg-orange-100 text-orange-500',
                total: 1,
                progress: cryptoCount,
                isUnlocked: cryptoCount >= 1
            },
            {
                id: 'stock_holder',
                title: 'Acionista',
                description: 'Compre sua primeira Ação ou FII.',
                icon: Landmark,
                color: 'bg-blue-50 text-blue-500',
                total: 1,
                progress: stockCount,
                isUnlocked: stockCount >= 1
            },
            {
                id: 'dollar_earner',
                title: 'Dollar Earner',
                description: 'Receba seu primeiro depósito/renda em Dólar.',
                icon: DollarSign,
                color: 'bg-green-100 text-green-700',
                total: 1,
                progress: dollarIncome ? 1 : 0,
                isUnlocked: dollarIncome
            },

            // --- TIER 2: MEDIUM / INTERMEDIÁRIO ---
            {
                id: 'emergency_fund',
                title: 'Reserva de Emergência',
                description: 'Atingir R$ 10.000,00 acumulados.',
                icon: Shield,
                color: 'bg-teal-100 text-teal-600',
                total: 10000,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 10000
            },
            {
                id: 'saver_1k',
                title: 'Poupança Inicial',
                description: 'Acumule R$ 1.000,00 em patrimônio total.',
                icon: PiggyBank,
                color: 'bg-emerald-100 text-emerald-600',
                total: 1000,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 1000
            },
            {
                id: 'regular_investor',
                title: 'Consistência',
                description: 'Faça 10 aportes em investimentos.',
                icon: Repeat,
                color: 'bg-cyan-100 text-cyan-600',
                total: 10,
                progress: savingsCount,
                isUnlocked: savingsCount >= 10
            },
            {
                id: 'goal_manager',
                title: 'Gerente de Metas',
                description: 'Conclua 3 metas financeiras.',
                icon: Trophy,
                color: 'bg-rose-200 text-rose-700',
                total: 3,
                progress: completedGoals,
                isUnlocked: completedGoals >= 3
            },
            {
                id: 'international',
                title: 'Global',
                description: 'Realize uma transação em moeda estrangeira (Dólar ou Euro).',
                icon: Globe,
                color: 'bg-indigo-100 text-indigo-600',
                total: 1,
                progress: hasForeignCurrency ? 1 : 0,
                isUnlocked: hasForeignCurrency
            },
            {
                id: 'diversified',
                title: 'Diversificado',
                description: 'Tenha ativos tanto em Ações quanto em Cripto.',
                icon: Divide,
                color: 'bg-orange-100 text-orange-600',
                total: 2,
                progress: (stockCount > 0 ? 1 : 0) + (cryptoCount > 0 ? 1 : 0),
                isUnlocked: stockCount > 0 && cryptoCount > 0
            },

            // --- TIER 3: HARD / EXPERT ---
            {
                id: 'shark',
                title: 'Tubarão',
                description: 'Tenha R$ 50.000,00 investidos em Ações.',
                icon: Briefcase,
                color: 'bg-blue-200 text-blue-800',
                total: 50000,
                progress: financialSummary.investmentCurrentValue,
                isUnlocked: financialSummary.investmentCurrentValue >= 50000
            },
            {
                id: 'crypto_tycoon',
                title: 'Rei do Bitcoin',
                description: 'Tenha R$ 20.000,00 em Criptoativos.',
                icon: Crown,
                color: 'bg-purple-200 text-purple-800',
                total: 20000,
                progress: financialSummary.cryptoCurrentValue,
                isUnlocked: financialSummary.cryptoCurrentValue >= 20000
            },
            {
                id: 'magnate',
                title: 'Magnata',
                description: 'Patrimônio Total de R$ 250.000,00.',
                icon: Gem,
                color: 'bg-fuchsia-100 text-fuchsia-600',
                total: 250000,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 250000
            },
            {
                id: 'whale',
                title: 'Baleia',
                description: 'Acumule R$ 50.000,00 em patrimônio total.',
                icon: Award,
                color: 'bg-purple-100 text-purple-600',
                total: 50000,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 50000
            },
            {
                id: 'millionaire',
                title: 'Milionário',
                description: 'Atingir a marca de R$ 1.000.000,00.',
                icon: Trophy,
                color: 'bg-amber-100 text-amber-600',
                total: 1000000,
                progress: financialSummary.balance + totalInvested,
                isUnlocked: (financialSummary.balance + totalInvested) >= 1000000
            }
        ];
    }, [transactions, goals, financialSummary]);

    const unlockedCount = achievementsList.filter(a => a.isUnlocked).length;
    const progressPercentage = (unlockedCount / achievementsList.length) * 100;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                        <Trophy className="text-yellow-300" size={32} /> Galeria de Conquistas
                    </h2>
                    <p className="text-emerald-100 opacity-90 max-w-2xl">
                        Desbloqueie medalhas atingindo seus objetivos financeiros. Acompanhe seu progresso e celebre cada vitória rumo à liberdade financeira!
                    </p>

                    <div className="mt-8">
                        <div className="flex justify-between text-sm font-semibold mb-2">
                            <span>Nível Atual: {unlockedCount > 3 ? (unlockedCount > 6 ? 'Mestre Financeiro' : 'Investidor Intermediário') : 'Aprendiz'}</span>
                            <span>{unlockedCount} / {achievementsList.length} Desbloqueadas</span>
                        </div>
                        <div className="w-full bg-emerald-900/50 h-4 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-1000 relative"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievementsList.map(achievement => (
                    <AchievementBadge key={achievement.id} achievement={achievement} onShare={setShareModal} />
                ))}
            </div>

            {/* Share Modal Overlay */}
            {shareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShareModal(null)}>
                    <div id="achievement-card" className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative transform transition-all scale-100 border-4 border-emerald-500" onClick={e => e.stopPropagation()}>
                        <div className="absolute -top-12 -left-12 -right-12 -bottom-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl -z-10"></div>
                        <div className="text-center">
                            <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-4">Nova Conquista Desbloqueada!</h3>
                            <div className={`w-32 h-32 mx-auto rounded-full ${shareModal.color} flex items-center justify-center mb-6 shadow-xl transform transition-transform`}>
                                <shareModal.icon size={64} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{shareModal.title}</h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8">{shareModal.description}</p>

                            <div className="flex gap-3" id="share-btn-row">
                                <button onClick={() => {
                                    const element = document.getElementById('achievement-card');
                                    const btnRow = document.getElementById('share-btn-row');
                                    // Hide button row for capture
                                    if (btnRow) btnRow.style.visibility = 'hidden';

                                    if (window.html2canvas) {
                                        window.html2canvas(element, {
                                            backgroundColor: null,
                                            scale: 2, // Higher quality
                                            useCORS: true
                                        }).then(canvas => {
                                            const link = document.createElement('a');
                                            link.download = `conquista_${shareModal.id}.png`;
                                            link.href = canvas.toDataURL('image/png');
                                            link.click();
                                            // Restore button row
                                            if (btnRow) btnRow.style.visibility = 'visible';
                                        }).catch(err => {
                                            console.error(err);
                                            alert("Erro ao gerar imagem.");
                                            if (btnRow) btnRow.style.visibility = 'visible';
                                        });
                                    } else {
                                        alert("Recurso de imagem carregando... Tente novamente em alguns segundos.");
                                        if (btnRow) btnRow.style.visibility = 'visible';
                                    }
                                }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                                    <Share2 size={18} /> Baixar Imagem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Icon Import Helpers
const PiggyBank = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 4 2 6 2.8 2.8 10.9 3.9 12.9 1.9 2-2 3.2-5.1 1.6-11.7-.8-3.2 0-3.3-2.5-3.2z" /><path d="M16 9v2" /><path d="M9 13.5v-3" /></svg>
);

export default Achievements;
