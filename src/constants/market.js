export const AVAILABLE_STOCKS = [
    // --- ETFs & ÍNDICES ---
    { ticker: 'SPY', name: 'S&P 500 ETF', basePrice: 445.00, defaultYield: 1.5, sector: 'ETF (Índice)', marketCap: 400000000000 },
    { ticker: 'QQQ', name: 'Invesco QQQ (Nasdaq)', basePrice: 372.00, defaultYield: 0.6, sector: 'ETF (Tecnologia)', marketCap: 200000000000 },
    { ticker: 'VT', name: 'Vanguard Total World', basePrice: 95.00, defaultYield: 2.1, sector: 'ETF Global', marketCap: 30000000000 },
    { ticker: 'VTI', name: 'Vanguard Total Stock', basePrice: 220.50, defaultYield: 1.6, sector: 'ETF (EUA)', marketCap: 1300000000000 },
    { ticker: 'VNQ', name: 'Vanguard Real Estate', basePrice: 82.00, defaultYield: 4.2, sector: 'ETF (Imóveis)', marketCap: 65000000000 },

    // --- TECNOLOGIA (BIG TECH) ---
    { ticker: 'AAPL', name: 'Apple Inc.', basePrice: 178.00, defaultYield: 0.5, sector: 'Tecnologia', marketCap: 2800000000000 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', basePrice: 330.00, defaultYield: 0.8, sector: 'Tecnologia', marketCap: 2500000000000 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', basePrice: 136.00, defaultYield: 0, sector: 'Tecnologia', marketCap: 1700000000000 },
    { ticker: 'AMZN', name: 'Amazon.com', basePrice: 135.00, defaultYield: 0, sector: 'Varejo', marketCap: 1400000000000 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', basePrice: 460.00, defaultYield: 0.04, sector: 'Semicondutores', marketCap: 1200000000000 },
    { ticker: 'META', name: 'Meta Platforms', basePrice: 298.00, defaultYield: 0, sector: 'Tecnologia', marketCap: 750000000000 },
    { ticker: 'TSLA', name: 'Tesla Inc.', basePrice: 245.00, defaultYield: 0, sector: 'Automotivo', marketCap: 800000000000 },

    // --- CONSUMO & VAREJO ---
    { ticker: 'KO', name: 'Coca-Cola Co.', basePrice: 58.00, defaultYield: 3.0, sector: 'Consumo', marketCap: 250000000000 },
    { ticker: 'PEP', name: 'PepsiCo Inc.', basePrice: 175.00, defaultYield: 2.8, sector: 'Consumo', marketCap: 240000000000 },
    { ticker: 'MCD', name: 'McDonald\'s', basePrice: 280.00, defaultYield: 2.3, sector: 'Consumo', marketCap: 200000000000 },
    { ticker: 'NKE', name: 'Nike Inc.', basePrice: 98.00, defaultYield: 1.2, sector: 'Varejo', marketCap: 150000000000 },
    { ticker: 'WMT', name: 'Walmart Inc.', basePrice: 162.00, defaultYield: 1.4, sector: 'Varejo', marketCap: 430000000000 },

    // --- FINANCEIRO ---
    { ticker: 'JPM', name: 'JPMorgan Chase', basePrice: 145.00, defaultYield: 2.9, sector: 'Financeiro', marketCap: 420000000000 },
    { ticker: 'V', name: 'Visa Inc.', basePrice: 245.00, defaultYield: 0.8, sector: 'Financeiro', marketCap: 500000000000 },
    { ticker: 'MA', name: 'Mastercard', basePrice: 410.00, defaultYield: 0.6, sector: 'Financeiro', marketCap: 390000000000 },
    { ticker: 'BRK.B', name: 'Berkshire Hathaway', basePrice: 360.00, defaultYield: 0, sector: 'Holding', marketCap: 780000000000 },

    // --- SAÚDE ---
    { ticker: 'JNJ', name: 'Johnson & Johnson', basePrice: 160.00, defaultYield: 2.8, sector: 'Saúde', marketCap: 400000000000 },
    { ticker: 'PFE', name: 'Pfizer Inc.', basePrice: 35.00, defaultYield: 4.5, sector: 'Saúde', marketCap: 190000000000 },
    { ticker: 'LLY', name: 'Eli Lilly', basePrice: 550.00, defaultYield: 0.9, sector: 'Saúde', marketCap: 500000000000 },

    // --- ENERGIA & OUTROS ---
    { ticker: 'XOM', name: 'Exxon Mobil', basePrice: 110.00, defaultYield: 3.4, sector: 'Energia', marketCap: 440000000000 },
    { ticker: 'CVX', name: 'Chevron', basePrice: 160.00, defaultYield: 3.8, sector: 'Energia', marketCap: 300000000000 },
    { ticker: 'DIS', name: 'Walt Disney', basePrice: 85.00, defaultYield: 0, sector: 'Entretenimento', marketCap: 150000000000 },
];

export const AVAILABLE_CRYPTO = [
    { ticker: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin' },
    { ticker: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
    { ticker: 'USDT', name: 'Tether', coingeckoId: 'tether' },
    { ticker: 'BNB', name: 'Binance Coin', coingeckoId: 'binancecoin' },
    { ticker: 'XRP', name: 'XRP', coingeckoId: 'ripple' },
    { ticker: 'USDC', name: 'USD Coin', coingeckoId: 'usd-coin' },
    { ticker: 'SOL', name: 'Solana', coingeckoId: 'solana' },
    { ticker: 'ADA', name: 'Cardano', coingeckoId: 'cardano' },
    { ticker: 'DOGE', name: 'Dogecoin', coingeckoId: 'dogecoin' },
    { ticker: 'TRX', name: 'TRON', coingeckoId: 'tron' },
    { ticker: 'MATIC', name: 'Polygon', coingeckoId: 'matic-network' },
    { ticker: 'LTC', name: 'Litecoin', coingeckoId: 'litecoin' },
    { ticker: 'DOT', name: 'Polkadot', coingeckoId: 'polkadot' },
    { ticker: 'AVAX', name: 'Avalanche', coingeckoId: 'avalanche-2' },
    { ticker: 'SHIB', name: 'Shiba Inu', coingeckoId: 'shiba-inu' },
];
