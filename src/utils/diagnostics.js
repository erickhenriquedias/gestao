export const runSystemDiagnostics = (transactions, categories, exchangeRates) => {
    const logs = [];
    let passed = 0;
    let failed = 0;
    const assert = (condition, message) => { if (condition) { passed++; logs.push({ status: 'pass', message }); } else { failed++; logs.push({ status: 'fail', message }); } };
    assert(exchangeRates.BRL === 1, 'Taxa BRL base ok');
    assert(categories.length > 0, 'Categorias carregadas');
    return { logs, passed, failed };
};
