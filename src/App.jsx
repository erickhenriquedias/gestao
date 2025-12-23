import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CalendarClock,
  CalendarRange,
  CalendarDays,
  ListFilter,
  Activity,
  Plus,
  TrendingUp,
  TrendingDown,
  Target
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useFirestore } from './hooks/useFirestore';
import { DISABLE_DB } from './services/firebase';
import { PRINT_STYLES } from './styles/printStyles';

// --- CONSTANTES ---
import { ICON_MAP } from './constants/icons';
import { PRESET_COLORS, DEFAULT_CATEGORIES } from './constants/categories';
import { CURRENCIES } from './constants/currencies';
import { AVAILABLE_STOCKS, AVAILABLE_CRYPTO } from './constants/market';

// --- UTILS ---
import {
  formatCurrency,
  formatPercentage,
  renderPriceOrOff,
  formatCurrencyUnit
} from './utils/formatters';
import {
  getTodayString,
  getDateInCurrentMonth,
  isFuture,
  isInCurrentMonth,
  isInCurrentYear,
  calculateMonthsDiff,
  isDateInSummaryPeriod as isDateInSummaryPeriodUtil // Importing logic if extracted, or keeping helper
} from './utils/date';
import { runSystemDiagnostics } from './utils/diagnostics';

// --- COMPONENTES ---
import LoginScreen from './components/auth/LoginScreen';
import RegistrationForm from './components/auth/RegistrationForm';
import Header from './components/layout/Header';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Select from './components/ui/Select';
import Input from './components/ui/Input';
import ConfirmationModal from './components/ui/ConfirmationModal';
import TestResultModal from './components/ui/TestResultModal';
import CategoryIcon from './components/ui/CategoryIcon';

import SummaryCards from './components/dashboard/SummaryCards';
import ChartSection from './components/dashboard/ChartSection';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';
import AssetList from './components/investments/AssetList';
import BudgetList from './components/budget/BudgetList';
import GoalList from './components/goals/GoalList';
import SettingsPanel from './components/settings/SettingsPanel';
import ImportModal from './components/transactions/ImportModal';
import AccountSettings from './components/settings/AccountSettings';
import Achievements from './components/gamification/Achievements';

// --- HELPERS DA PÁGINA PRINCIPAL ---

const App = () => {
  // --- AUTH STATE ---
  const { user, loading: loadingAuth, loginWithGoogle, logout } = useAuth();
  const { data: cloudTransactions, add: addCloudTx, remove: removeCloudTx, syncLocalData: syncTx } = useFirestore('transactions');
  const { data: cloudGoals, add: addCloudGoal, remove: removeCloudGoal, syncLocalData: syncGoals } = useFirestore('goals');

  const [userProfile, setUserProfile] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // --- APP SETTINGS STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finance_theme') === 'dark';
    }
    return false;
  });

  const [summaryPeriod, setSummaryPeriod] = useState('month');
  const [view, setView] = useState('dashboard');

  // --- DATA STATE ---
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finance_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (!saved) {
      // Initial Dummy Data
      return [
        { id: 1, description: 'Salário Mensal', amount: 5000, type: 'income', category: 'salary', date: getDateInCurrentMonth(5), currency: 'BRL', historicalRate: 1 },
        { id: 2, description: 'Aluguel', amount: 1200, type: 'expense', category: 'fixed', date: getDateInCurrentMonth(10), currency: 'BRL', historicalRate: 1 },
        { id: 3, description: 'Freelance EUA', amount: 200, type: 'income', category: 'extra', date: getDateInCurrentMonth(28), currency: 'USD', historicalRate: 5.05 },
        { id: 4, description: 'Internet (A Pagar)', amount: 150, type: 'expense', category: 'fixed', date: getDateInCurrentMonth(25), currency: 'BRL', historicalRate: 1 },
        { id: 5, description: 'Aporte MXRF11 (Antigo)', amount: 1000, type: 'expense', category: 'investment', date: getDateInCurrentMonth(12), returnRate: 1.05, projectedReturn: 10.50, ticker: 'MXRF11', quantity: 100, currency: 'BRL', historicalRate: 1 },
        { id: 6, description: 'Compra Bitcoin (Antigo)', amount: 500, type: 'expense', category: 'crypto', date: getDateInCurrentMonth(15), returnRate: 0, projectedReturn: 0, ticker: 'BTC', quantity: 0.002, currency: 'BRL', historicalRate: 1 },
        { id: 7, description: 'Supermercado Semanal', amount: 450, type: 'expense', category: 'variable', date: getDateInCurrentMonth(8), currency: 'BRL', historicalRate: 1 },
        { id: 8, description: 'Jantar Fora', amount: 200, type: 'expense', category: 'variable', date: getDateInCurrentMonth(14), currency: 'BRL', historicalRate: 1 },
      ];
    }
    return JSON.parse(saved);
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finance_goals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Viagem Europa', targetAmount: 15000, currentAmount: 3500, deadline: '2024-12-31', color: '#f59e0b', icon: 'PlaneTakeoff' },
      { id: 2, name: 'Reserva Emergência', targetAmount: 20000, currentAmount: 8000, deadline: '2025-06-30', color: '#10b981', icon: 'Shield' }
    ];
  });

  const [exchangeRates, setExchangeRates] = useState({ BRL: 1, USD: 5.0, EUR: 5.40 });
  const [marketData, setMarketData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // --- UI STATE ---
  const [showFutures, setShowFutures] = useState(true);
  const [showAssetFutures, setShowAssetFutures] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, idToDelete: null, type: 'transaction', message: '' });
  const [groupByAsset, setGroupByAsset] = useState(true);
  const [chartType, setChartType] = useState('expense');
  const [chartPeriod, setChartPeriod] = useState('month');
  const [hiddenCategories, setHiddenCategories] = useState([]);
  const [listFilterPeriod, setListFilterPeriod] = useState('all');
  const [listFilterCategory, setListFilterCategory] = useState('all');
  const [listFilterType, setListFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [testResult, setTestResult] = useState(null);

  // --- RESTORE SYSTEM CATEGORIES IF MISSING ---
  useEffect(() => {
    const systemCategories = ['investment', 'crypto', 'goals_contribution'];
    const missing = systemCategories.filter(id => !categories.some(c => c.id === id));

    if (missing.length > 0) {
      const restored = missing.map(id => DEFAULT_CATEGORIES.find(dc => dc.id === id)).filter(Boolean);
      if (restored.length > 0) {
        setCategories(prev => [...prev, ...restored]);
      }
    }
  }, [categories]);

  // --- FORMS STATE ---
  const [formData, setFormData] = useState({
    description: '', amount: '', type: 'expense', category: 'variable', date: getTodayString(), isRecurring: false, recurrenceCount: 12, ticker: '', currency: 'BRL', goalId: ''
  });
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', currentAmount: '', deadline: '', icon: 'Target', color: PRESET_COLORS[0] });
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', color: PRESET_COLORS[0], icon: 'ShoppingBag' });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('finance_theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  useEffect(() => { localStorage.setItem('finance_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('finance_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('finance_goals', JSON.stringify(goals)); }, [goals]);


  // --- AUTH EFFECTS ---
  // --- AUTH EFFECTS ---
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`finance_profile_${user.uid}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setIsRegistering(false);
      } else {
        setIsRegistering(true);
      }
    }
  }, [user]);

  // --- SYNC LOGIC ---
  useEffect(() => {
    if (user && !loadingAuth) {
      if (cloudTransactions.length > 0) setTransactions(cloudTransactions);
      if (cloudGoals.length > 0) setGoals(cloudGoals);

      if (!localStorage.getItem(`synced_${user.uid}`)) {
        if (transactions.length > 0) syncTx(transactions);
        if (goals.length > 0) syncGoals(goals);
        localStorage.setItem(`synced_${user.uid}`, 'true');
      }
    }
  }, [user, loadingAuth, cloudTransactions, cloudGoals]);



  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login Error:", error);
    }
  };


  const handleLogout = async () => {
    if (window.confirm("Deseja sair da conta?")) {
      await logout();
      setView('dashboard');
    }
  };


  const handleRegistrationComplete = (data) => {
    if (user) {
      localStorage.setItem(`finance_profile_${user.uid}`, JSON.stringify(data));
      setUserProfile(data);
      setIsRegistering(false);
    }
  };

  const handleUpdateProfile = (newData) => {
    if (user) {
      localStorage.setItem(`finance_profile_${user.uid}`, JSON.stringify(newData));
      setUserProfile(newData);
      alert('Perfil atualizado com sucesso!');
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- DATE & CURRENCY HELPERS ---
  const getConvertedAmount = useCallback((amount, currency) => {
    const rate = exchangeRates[currency] || 1;
    return Number(amount) * rate;
  }, [exchangeRates]);

  const getHistoricalBRLValue = useCallback((transaction) => {
    const currency = transaction.currency || 'BRL';
    const rate = transaction.historicalRate || exchangeRates[currency] || 1;
    return Number(transaction.amount) * rate;
  }, [exchangeRates]);

  const isDateInSummaryPeriod = useCallback((dateStr, period) => {
    const tDate = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const tDateNorm = new Date(tDate);
    tDateNorm.setHours(0, 0, 0, 0);

    if (period === 'month') return isInCurrentMonth(dateStr);
    if (period === 'year') return isInCurrentYear(dateStr);
    if (period === 'last3') {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      threeMonthsAgo.setHours(0, 0, 0, 0);
      return tDateNorm >= threeMonthsAgo && tDateNorm <= today;
    }
    if (period === 'last6') {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      sixMonthsAgo.setHours(0, 0, 0, 0);
      return tDateNorm >= sixMonthsAgo && tDateNorm <= today;
    }
    if (period === 'all') return true;
    return false;
  }, []);

  // --- MARKET DATA ---
  const refreshMarketData = async () => {
    setLoadingMarket(true);
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
      if (response.ok) {
        const data = await response.json();
        setExchangeRates({ BRL: 1, USD: parseFloat(data.USDBRL.bid), EUR: parseFloat(data.EURBRL.bid) });
      }
    } catch (error) { console.error("Erro câmbio", error); }

    try {
      const ids = AVAILABLE_CRYPTO.map(c => c.coingeckoId).join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true`);
      if (response.ok) {
        const data = await response.json();
        const realCryptoData = AVAILABLE_CRYPTO.map(coin => {
          const coinData = data[coin.coingeckoId];
          return {
            ...coin,
            price: coinData ? coinData.brl : null,
            variation: coinData ? coinData.brl_24h_change : null,
            marketCap: coinData ? coinData.brl_market_cap : null,
            volume24h: coinData ? coinData.brl_24h_vol : null,
            lastUpdated: coinData ? coinData.last_updated_at : null
          };
        });
        setCryptoData(realCryptoData);
      } else { throw new Error("API Error"); }
    } catch (error) {
      const offCrypto = AVAILABLE_CRYPTO.map(c => ({
        ...c,
        price: null,
        variation: null,
        marketCap: null,
        volume24h: null,
        lastUpdated: null
      }));
      setCryptoData(offCrypto);
    }

    // Since we don't have a public free B3 API without auth, we'll use our constants as "Live" data for now
    // or set price to basePrice + small random variation to simulate live market
    const enhancedStocks = AVAILABLE_STOCKS.map(s => {
      const variation = (Math.random() * 2 - 1); // Mock variation -1% to 1%
      const simulatedPrice = s.basePrice * (1 + (variation / 100));
      return {
        ...s,
        price: simulatedPrice,
        variation: variation,
        sector: s.sector,
        marketCap: s.marketCap,
        dividendYield: s.defaultYield
      };
    });
    setMarketData(enhancedStocks);
    setLoadingMarket(false);
  };

  useEffect(() => {
    if (user) {
      refreshMarketData();
      const interval = setInterval(() => { refreshMarketData(); }, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getCurrentPrice = (ticker, category) => {
    let asset;
    if (category === 'crypto') asset = cryptoData.find(c => c.ticker === ticker);
    else asset = marketData.find(s => s.ticker === ticker);
    return asset && asset.price !== null ? asset.price : null;
  };

  const getDefaultYield = (ticker, category) => {
    let assetList = category === 'crypto' ? AVAILABLE_CRYPTO : AVAILABLE_STOCKS;
    const asset = assetList.find(a => a.ticker === ticker);
    return asset ? asset.defaultYield : 0;
  }

  // --- MEMOIZED DERIVED DATA ---
  const sortedTransactions = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)), [transactions]);

  const getCategoryDetails = (id) => categories.find(c => c.id === id) || { name: 'Desconhecido', color: '#cbd5e1', icon: 'HelpCircle' };

  const categorySpending = useMemo(() => {
    const spending = {};
    const monthTransactions = transactions.filter(t => t.type === 'expense' && !isFuture(t.date) && isInCurrentMonth(t.date));
    monthTransactions.forEach(t => { spending[t.category] = (spending[t.category] || 0) + getHistoricalBRLValue(t); });
    return spending;
  }, [transactions, getHistoricalBRLValue]);

  const financialSummary = useMemo(() => {
    const activeTransactions = transactions.filter(t => !isFuture(t.date));
    const pendingTransactions = transactions.filter(t => isFuture(t.date) && isInCurrentMonth(t.date));

    let filteredTransactions = activeTransactions.filter(t => isDateInSummaryPeriod(t.date, summaryPeriod));

    const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);

    const pendingIncome = pendingTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + getConvertedAmount(Number(curr.amount), curr.currency || 'BRL'), 0);
    const pendingExpenses = pendingTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + getConvertedAmount(Number(curr.amount), curr.currency || 'BRL'), 0);
    const balance = income - expenses;

    const totalIncomeAllTime = activeTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);
    const totalExpensesAllTime = activeTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);
    const currentTotalBalance = totalIncomeAllTime - totalExpensesAllTime;
    const projectedBalance = currentTotalBalance + pendingIncome - pendingExpenses;

    const investmentCost = activeTransactions.filter(t => t.category === 'investment').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);
    const cryptoCost = activeTransactions.filter(t => t.category === 'crypto').reduce((acc, curr) => acc + getHistoricalBRLValue(curr), 0);
    const investmentCurrentValue = activeTransactions.filter(t => t.category === 'investment').reduce((acc, curr) => {
      const currentPrice = getCurrentPrice(curr.ticker, 'investment');
      if (currentPrice && curr.quantity) return acc + (Number(curr.quantity) * currentPrice);
      else return acc + getConvertedAmount(Number(curr.amount), curr.currency || 'BRL');
    }, 0);
    const cryptoCurrentValue = activeTransactions.filter(t => t.category === 'crypto').reduce((acc, curr) => {
      const currentPrice = getCurrentPrice(curr.ticker, 'crypto');
      if (currentPrice && curr.quantity) return acc + (Number(curr.quantity) * currentPrice);
      else return acc + getConvertedAmount(Number(curr.amount), curr.currency || 'BRL');
    }, 0);
    const projectedMonthlyIncome = activeTransactions.filter(t => (t.category === 'investment' || t.category === 'crypto') && t.projectedReturn).reduce((acc, curr) => acc + Number(curr.projectedReturn), 0);

    return { income, expenses, pendingIncome, pendingExpenses, balance, projectedBalance, investmentCost, investmentCurrentValue, investmentAppreciation: investmentCurrentValue - investmentCost, cryptoCost, cryptoCurrentValue, cryptoAppreciation: cryptoCurrentValue - cryptoCost, projectedMonthlyIncome };
  }, [transactions, marketData, cryptoData, categories, getConvertedAmount, getHistoricalBRLValue, summaryPeriod, isDateInSummaryPeriod, getCurrentPrice]);

  const filteredTransactionsList = useMemo(() => {
    let filtered = [...transactions];
    if (!showFutures) filtered = filtered.filter(t => !isFuture(t.date));
    if (listFilterType !== 'all') filtered = filtered.filter(t => t.type === listFilterType);
    if (listFilterCategory !== 'all') filtered = filtered.filter(t => t.category === listFilterCategory);

    if (listFilterPeriod !== 'all') {
      filtered = filtered.filter(t => isDateInSummaryPeriod(t.date, listFilterPeriod));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, showFutures, listFilterPeriod, listFilterCategory, listFilterType, isDateInSummaryPeriod]);

  const totalPages = Math.ceil(filteredTransactionsList.length / itemsPerPage);

  const assetSummary = useMemo(() => {
    const categoryFilter = view === 'investments' ? 'investment' : 'crypto';
    const activeAssets = transactions.filter(t => t.category === categoryFilter && (showAssetFutures || !isFuture(t.date)));
    if (!groupByAsset) return activeAssets;
    const grouped = {};
    activeAssets.forEach(t => {
      const key = t.ticker || t.description;
      if (!grouped[key]) grouped[key] = { ...t, quantity: 0, amount: 0, projectedReturn: 0, count: 0 };
      grouped[key].quantity += t.quantity ? Number(t.quantity) : 0;
      grouped[key].amount += getHistoricalBRLValue(t);
      grouped[key].projectedReturn += Number(t.projectedReturn || 0);
      grouped[key].count += 1;
      if (new Date(t.date) > new Date(grouped[key].date)) grouped[key].date = t.date;
    });
    return Object.values(grouped);
  }, [transactions, view, groupByAsset, showAssetFutures, getHistoricalBRLValue]);

  const chartData = useMemo(() => {
    let filteredTrans = transactions.filter(t => !isFuture(t.date));
    if (chartPeriod !== 'all') {
      filteredTrans = filteredTrans.filter(t => isDateInSummaryPeriod(t.date, chartPeriod));
    }

    filteredTrans = filteredTrans.filter(t => t.type === chartType);
    const grouped = {};
    let totalValue = 0;
    filteredTrans.forEach(t => {
      if (hiddenCategories.includes(t.category)) return;
      if (!grouped[t.category]) grouped[t.category] = 0;
      const valBRL = getHistoricalBRLValue(t);
      grouped[t.category] += valBRL;
      totalValue += valBRL;
    });
    const data = Object.keys(grouped).map(catId => {
      const catDetails = getCategoryDetails(catId);
      const value = grouped[catId];
      return {
        name: catDetails.name,
        value: value,
        color: catDetails.color
      };
    });

    if (chartType === 'income' && financialSummary.projectedMonthlyIncome > 0 && !hiddenCategories.includes('passive_income')) {
      data.push({
        name: 'Renda Passiva (Est.)',
        value: financialSummary.projectedMonthlyIncome,
        color: '#8b5cf6'
      });
      totalValue += financialSummary.projectedMonthlyIncome;
    }

    return data.map(item => ({
      ...item,
      percent: totalValue > 0 ? (item.value / totalValue) * 100 : 0
    })).filter(item => item.value > 0);
  }, [transactions, categories, chartType, chartPeriod, hiddenCategories, getHistoricalBRLValue, financialSummary.projectedMonthlyIncome, isDateInSummaryPeriod]);

  const activeChartCategories = useMemo(() => {
    const cats = categories.filter(c => c.type === chartType);
    if (chartType === 'income' && financialSummary.projectedMonthlyIncome > 0) {
      cats.push({ id: 'passive_income', name: 'Renda Passiva (Est.)', color: '#8b5cf6', type: 'income', icon: 'Zap' });
    }
    return cats;
  }, [categories, chartType, financialSummary.projectedMonthlyIncome]);

  // --- ACTIONS ---
  const handleAddCategory = () => {
    if (!newCat.name) return;
    const id = newCat.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4);
    setCategories([...categories, { ...newCat, id }]);
    setNewCat({ name: '', type: 'expense', color: PRESET_COLORS[0], icon: 'ShoppingBag' });
  };

  const handleDeleteCategory = (id) => { openDeleteModal(id, 'category', 'Atenção: Lançamentos antigos ficarão sem categoria.'); };
  const toggleCategoryVisibility = (catId) => { setHiddenCategories(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]); };
  const handleUpdateBudget = (catId, newBudget) => {
    const updatedCategories = categories.map(c => c.id === catId ? { ...c, budget: parseFloat(newBudget) || 0 } : c);
    setCategories(updatedCategories);
  };
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.targetAmount) return;
    const newGoal = { id: Date.now(), ...goalForm, targetAmount: parseFloat(goalForm.targetAmount), currentAmount: parseFloat(goalForm.currentAmount) || 0 };
    if (user && !DISABLE_DB) {
      addCloudGoal(newGoal);
    } else {
      setGoals([...goals, newGoal]);
    }
    setGoalForm({ name: '', targetAmount: '', currentAmount: '', deadline: '', icon: 'Target', color: PRESET_COLORS[0] });
  };
  const handleDeleteGoal = (id) => { openDeleteModal(id, 'goal', 'Tem certeza que deseja excluir esta meta?'); };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'type') {
        const firstValidCategory = categories.find(c => c.type === value);
        if (firstValidCategory) {
          newData.category = firstValidCategory.id;
        }
      }
      if (name === 'ticker' && value) {
        const isCrypto = AVAILABLE_CRYPTO.some(c => c.ticker === value);
        const assetName = isCrypto ? AVAILABLE_CRYPTO.find(c => c.ticker === value)?.name : AVAILABLE_STOCKS.find(s => s.ticker === value)?.name;
        newData.description = `Compra de ${assetName || value}`;
      }
      return newData;
    });
  };
  const handleAssetSelect = (asset) => { setFormData(prev => ({ ...prev, ticker: asset.ticker, description: `Compra de ${asset.name}` })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    let calculatedQuantity = null;
    let autoReturnRate = 0;
    let autoProjectedReturn = 0;
    const currentExchangeRate = exchangeRates[formData.currency] || 1;
    if ((formData.category === 'investment' || formData.category === 'crypto') && formData.ticker) {
      const currentPrice = getCurrentPrice(formData.ticker, formData.category);
      if (currentPrice !== null) {
        const amountBRL = parseFloat(formData.amount) * currentExchangeRate;
        calculatedQuantity = amountBRL / currentPrice;
      }
      autoReturnRate = getDefaultYield(formData.ticker, formData.category);
      if (autoReturnRate > 0) autoProjectedReturn = (parseFloat(formData.amount) * (autoReturnRate / 100));
    }

    let finalCategory = formData.category;
    const categoryObj = categories.find(c => c.id === finalCategory);
    if (categoryObj && categoryObj.type !== formData.type) {
      const fallbackCat = categories.find(c => c.type === formData.type);
      if (fallbackCat) finalCategory = fallbackCat.id;
    }

    const baseTransaction = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: finalCategory,
      ticker: formData.ticker,
      quantity: calculatedQuantity,
      returnRate: autoReturnRate,
      projectedReturn: autoProjectedReturn,
      currency: formData.currency,
      historicalRate: currentExchangeRate
    };

    if (finalCategory === 'goals_contribution' && formData.goalId) {
      const amountBRL = getConvertedAmount(parseFloat(formData.amount), formData.currency);
      setGoals(prevGoals => prevGoals.map(g =>
        g.id.toString() === formData.goalId.toString()
          ? { ...g, currentAmount: g.currentAmount + amountBRL }
          : g
      ));
    }

    const newTransactions = [];
    const [y, m, d] = formData.date.split('-').map(Number);
    if (formData.isRecurring && formData.recurrenceCount > 0) {
      for (let i = 0; i < formData.recurrenceCount; i++) {
        const dateObj = new Date(y, (m - 1) + i, d);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        newTransactions.push({ ...baseTransaction, id: Date.now() + i, date: formattedDate, isRecurringInstance: true });
      }
    } else {
      newTransactions.push({ ...baseTransaction, id: Date.now(), date: formData.date });
    }
    if (user && !DISABLE_DB) {
      newTransactions.forEach((tx) => addCloudTx(tx));
    } else {
      setTransactions([...newTransactions, ...transactions]);
    }


    const defaultExpenseCat = categories.find(c => c.type === 'expense')?.id || 'variable';
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: defaultExpenseCat,
      date: getTodayString(),
      isRecurring: false,
      recurrenceCount: 12,
      ticker: '',
      currency: 'BRL',
      goalId: ''
    });
  };

  const openDeleteModal = (id, type = 'transaction', message = 'Remover este registro permanentemente?') => { setDeleteModal({ isOpen: true, idToDelete: id, type, message }); };
  const closeDeleteModal = () => { setDeleteModal({ isOpen: false, idToDelete: null, type: 'transaction', message: '' }); };
  const confirmDelete = () => {
    if (deleteModal.idToDelete !== null) {
      if (deleteModal.type === 'transaction') {
        if (user && !DISABLE_DB) removeCloudTx(deleteModal.idToDelete);
        else setTransactions(transactions.filter(t => t.id !== deleteModal.idToDelete));
      }
      else if (deleteModal.type === 'goal') {
        if (user && !DISABLE_DB) removeCloudGoal(deleteModal.idToDelete);
        else setGoals(goals.filter(g => g.id !== deleteModal.idToDelete));
      }
      else if (deleteModal.type === 'category') setCategories(categories.filter(c => c.id !== deleteModal.idToDelete));
      closeDeleteModal();
    }
  };

  const getProgressBarColor = (spent, budget) => {
    if (!budget || budget === 0) return 'bg-slate-300';
    const percentage = (spent / budget) * 100;
    if (percentage < 75) return 'bg-emerald-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  const handleRunTests = () => { const result = runSystemDiagnostics(transactions, categories, exchangeRates); setTestResult(result); };

  const handleImportTransactions = async (importedItems) => {
    if (!importedItems || importedItems.length === 0) return;

    let newTransactions = [...transactions];

    if (user && !DISABLE_DB) {
      for (const item of importedItems) {
        await addCloudTx(item);
      }
    } else {
      newTransactions = [...newTransactions, ...importedItems];
      setTransactions(newTransactions);
    }

    alert(`${importedItems.length} transações importadas com sucesso!`);
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor Orig.', 'Moeda', 'Cotação Hist.', 'Valor BRL', 'Ticker', 'Quantidade'];
    const rows = filteredTransactionsList.map(t => {
      const catName = getCategoryDetails(t.category).name;
      const rateUsed = t.historicalRate || exchangeRates[t.currency || 'BRL'] || 1;
      const amountBRL = t.amount * rateUsed;
      return [t.date, `"${t.description.replace(/"/g, '""')}"`, catName, t.type === 'income' ? 'Entrada' : 'Saída', t.amount.toFixed(2), t.currency || 'BRL', rateUsed.toFixed(2), amountBRL.toFixed(2), t.ticker || '', t.quantity || ''].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { const url = URL.createObjectURL(blob); link.setAttribute('href', url); link.setAttribute('download', `finance_report_${getTodayString()}.csv`); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link); }
  };

  const renderTrend = (value) => {
    if (value === null || value === undefined) return <Activity size={16} className="text-slate-400" />;
    if (value > 0.01) return <Activity size={16} className="text-emerald-500" />;
    if (value < -0.01) return <Activity size={16} className="text-rose-500" />;
    return <Activity size={16} className="text-slate-400 dark:text-slate-500" />;
  };

  if (!user && !loadingAuth) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user && isRegistering) {
    return <RegistrationForm user={user} onComplete={handleRegistrationComplete} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <style>{PRINT_STYLES}</style>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 pb-20 transition-colors duration-200 relative">

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          message={deleteModal.message}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Excluir?"
        />

        <TestResultModal
          result={testResult}
          onClose={() => setTestResult(null)}
        />

        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportTransactions}
          categories={categories}
        />

        <Header
          userProfile={userProfile}
          view={view}
          setView={setView}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />

        <main className="max-w-6xl mx-auto px-4 -mt-16 space-y-8">
          {view === 'dashboard' && (
            <div className="flex flex-col gap-6 no-print">
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
                    <button onClick={() => setSummaryPeriod('month')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${summaryPeriod === 'month' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}><CalendarClock size={14} /> Mês Atual</button>
                    <button onClick={() => setSummaryPeriod('last3')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${summaryPeriod === 'last3' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}><CalendarRange size={14} /> 3 Meses</button>
                    <button onClick={() => setSummaryPeriod('last6')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${summaryPeriod === 'last6' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}><CalendarRange size={14} /> 6 Meses</button>
                    <button onClick={() => setSummaryPeriod('year')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${summaryPeriod === 'year' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}><CalendarDays size={14} /> Ano Atual</button>
                    <button onClick={() => setSummaryPeriod('all')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${summaryPeriod === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}><ListFilter size={14} /> Tudo</button>
                  </div>
                </div>
                <SummaryCards financialSummary={financialSummary} />
              </div>

              <TransactionForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                categories={categories}
                goals={goals}
                marketData={marketData}
                cryptoData={cryptoData}
                handleAssetSelect={handleAssetSelect}
              />

              <ChartSection
                chartData={chartData}
                activeChartCategories={activeChartCategories}
                hiddenCategories={hiddenCategories}
                toggleCategoryVisibility={toggleCategoryVisibility}
                chartType={chartType}
                setChartType={setChartType}
                chartPeriod={chartPeriod}
                setChartPeriod={setChartPeriod}
                darkMode={darkMode}
              />

              <Card className="p-6 flex flex-col w-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2"><Activity size={20} className="text-slate-400" /><h3 className="font-bold text-slate-700 dark:text-slate-200">Últimas</h3></div>
                  <button onClick={() => setView('transactions')} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Ver todas</button>
                </div>
                <div className="flex-1 overflow-y-auto max-h-64 space-y-3 pr-2">
                  {sortedTransactions.filter(t => !isFuture(t.date)).slice(0, 5).map((t) => {
                    const cat = getCategoryDetails(t.category);
                    // Using a quick inline calc for display consistency with original
                    const isForeign = t.currency && t.currency !== 'BRL';
                    const convertedVal = getConvertedAmount(t.amount, t.currency);
                    return (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                            {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <CategoryIcon iconName={cat.icon} size={10} />
                              <span className="capitalize">{cat.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold block ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {t.type === 'expense' ? '-' : '+'} {isForeign ? formatCurrency(t.amount, t.currency) : formatCurrency(t.amount)}
                          </span>
                          {isForeign && <span className="text-[10px] text-slate-400 block">≈ {formatCurrency(convertedVal)}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}

          {view === 'budgets' && (
            <BudgetList
              categories={categories}
              categorySpending={categorySpending}
              handleUpdateBudget={handleUpdateBudget}
              getProgressBarColor={getProgressBarColor}
            />
          )}

          {view === 'goals' && (
            <>
              <Card className="p-6 mb-8 w-full">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Target size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Nova Meta Financeira</h2>
                </div>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input label="Nome da Meta" placeholder="Ex: Viagem, Carro" value={goalForm.name} onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))} required />
                    <Input label="Valor Alvo (R$)" type="number" placeholder="0.00" value={goalForm.targetAmount} onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))} required />
                    <Input label="Prazo" type="date" value={goalForm.deadline} onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))} required />
                    <Select label="Ícone" value={goalForm.icon} onChange={(e) => setGoalForm(prev => ({ ...prev, icon: e.target.value }))}>
                      {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Cor</label>
                    <div className="flex gap-3 flex-wrap">
                      {PRESET_COLORS.map(color => (
                        <button key={color} type="button" onClick={() => setGoalForm(prev => ({ ...prev, color }))} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${goalForm.color === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full"><Plus size={20} /> Criar Meta</Button>
                </form>
              </Card>
              <GoalList
                goals={goals}
                handleDeleteGoal={handleDeleteGoal}
              />
            </>
          )}

          {view === 'settings' && (
            <SettingsPanel
              categories={categories}
              newCat={newCat}
              setNewCat={setNewCat}
              handleAddCategory={handleAddCategory}
              handleDeleteCategory={handleDeleteCategory}
              handleRunTests={handleRunTests}
            />
          )}

          {view === 'account' && (
            <AccountSettings
              user={user}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onSave={handleUpdateProfile}
            />
          )}

          {view === 'achievements' && (
            <Achievements
              transactions={transactions}
              goals={goals}
              financialSummary={financialSummary}
              userProfile={userProfile}
            />
          )}

          {view === 'transactions' && (
            <TransactionList
              filteredTransactionsList={filteredTransactionsList}
              categories={categories}
              listFilterPeriod={listFilterPeriod}
              setListFilterPeriod={setListFilterPeriod}
              listFilterType={listFilterType}
              setListFilterType={setListFilterType}
              listFilterCategory={listFilterCategory}
              setListFilterCategory={setListFilterCategory}
              showFutures={showFutures}
              setShowFutures={setShowFutures}
              exportToCSV={exportToCSV}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              openDeleteModal={(id, type) => openDeleteModal(id, type)}
              onOpenImport={() => setIsImportModalOpen(true)}
            />
          )}

          {(view === 'investments' || view === 'crypto') && (
            <AssetList
              view={view}
              financialSummary={financialSummary}
              marketData={marketData}
              cryptoData={cryptoData}
              assetSummary={assetSummary}
              groupByAsset={groupByAsset}
              setGroupByAsset={setGroupByAsset}
              getCurrentPrice={getCurrentPrice}
              renderTrend={renderTrend}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;