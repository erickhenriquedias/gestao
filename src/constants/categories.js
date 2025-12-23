export const PRESET_COLORS = [
    '#0ea5e9', '#f43f5e', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444',
    '#f97316', '#eab308', '#84cc16', '#06b6d4', '#3b82f6', '#6366f1',
    '#d946ef', '#ec4899', '#64748b', '#14b8a6', '#a855f7', '#be185d',
    '#b45309', '#15803d', '#1e40af', '#4c1d95', '#78350f', '#881337'
];

export const DEFAULT_CATEGORIES = [
    { id: 'fixed', name: 'Gasto Fixo', type: 'expense', color: '#0ea5e9', icon: 'Home', budget: 2000 },
    { id: 'variable', name: 'Gasto Variável', type: 'expense', color: '#f43f5e', icon: 'ShoppingBag', budget: 1000 },
    { id: 'investment', name: 'Investimentos', type: 'expense', color: '#8b5cf6', icon: 'TrendingUp', budget: 500 },
    { id: 'crypto', name: 'Cripto', type: 'expense', color: '#f59e0b', icon: 'Bitcoin', budget: 200 },
    { id: 'goals_contribution', name: 'Aporte em Meta', type: 'expense', color: '#6366f1', icon: 'Target', budget: 0 },
    { id: 'subscription', name: 'Assinaturas', type: 'expense', color: '#a855f7', icon: 'CalendarDays', budget: 300 },
    { id: 'salary', name: 'Salário', type: 'income', color: '#10b981', icon: 'Wallet', budget: 0 },
    { id: 'extra', name: 'Renda Extra', type: 'income', color: '#34d399', icon: 'DollarSign', budget: 0 },
];
