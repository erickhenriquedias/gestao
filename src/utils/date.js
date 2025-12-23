export const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getDateInCurrentMonth = (day) => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayFormatted = String(day).padStart(2, '0');
    return `${year}-${month}-${dayFormatted}`;
};

export const isFuture = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateString.split('-').map(Number);
    const transDate = new Date(year, month - 1, day);
    return transDate > today;
};

export const isInCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return year === today.getFullYear() && (month - 1) === today.getMonth();
};

export const isInCurrentYear = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return year === today.getFullYear();
};

export const calculateMonthsDiff = (d1, d2) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
};

export const isDateInSummaryPeriod = (dateStr, period) => {
    if (!dateStr) return false;
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
};
