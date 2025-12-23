import React from 'react';
import {
    Wallet, Settings, Sun, Moon, LogOut,
    LineChart, Bitcoin, PiggyBank, Target, User, Trophy, CalendarDays
} from 'lucide-react';

const Header = ({
    userProfile,
    view,
    setView,
    darkMode,
    toggleTheme,
    handleLogout
}) => {
    return (
        <header className="bg-emerald-900 dark:bg-emerald-950 text-white pb-24 pt-8 px-4 md:px-8 shadow-lg transition-colors duration-200 no-print">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-800 dark:bg-emerald-900 rounded-lg">
                        <Wallet size={32} className="text-emerald-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Gestor Financeiro</h1>
                        <p className="text-emerald-300 text-sm">Olá, {userProfile?.nickname || userProfile?.name || 'Visitante'}!</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-emerald-800 dark:bg-emerald-900 p-1 rounded-lg overflow-x-auto flex-1 md:flex-none">
                        <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>Dashboard</button>
                        <button onClick={() => setView('transactions')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'transactions' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>Lançamentos</button>
                        <button onClick={() => setView('investments')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'investments' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}><LineChart size={16} /> Ações</button>
                        <button onClick={() => setView('crypto')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'crypto' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}><Bitcoin size={16} /> Cripto</button>
                        <button onClick={() => setView('budgets')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'budgets' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}><PiggyBank size={16} /> Orçamentos</button>
                        <button onClick={() => setView('goals')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'goals' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}><Target size={16} /> Metas</button>
                        <button onClick={() => setView('achievements')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'achievements' ? 'bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-sm' : 'text-emerald-100 hover:text-white'}`}><Trophy size={16} /> Conquistas</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setView('account')} className={`p-2.5 rounded-lg transition-colors ${view === 'account' ? 'bg-white text-emerald-900' : 'bg-emerald-800 dark:bg-emerald-900 text-emerald-100 hover:bg-emerald-700'}`} title="Minha Conta"><User size={20} /></button>
                        <button onClick={() => setView('settings')} className={`p-2.5 rounded-lg transition-colors ${view === 'settings' ? 'bg-white text-emerald-900' : 'bg-emerald-800 dark:bg-emerald-900 text-emerald-100 hover:bg-emerald-700'}`} title="Configurações"><Settings size={20} /></button>
                        <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-emerald-800 dark:bg-emerald-900 text-emerald-100 hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors" title={darkMode ? "Mudar para Claro" : "Mudar para Escuro"}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                        <button onClick={handleLogout} className="p-2.5 rounded-lg bg-rose-800 dark:bg-rose-900 text-rose-100 hover:bg-rose-700 dark:hover:bg-rose-800 transition-colors" title="Sair"><LogOut size={20} /></button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
