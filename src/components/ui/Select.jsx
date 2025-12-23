import React from 'react';

const Select = ({ label, children, className = "", ...props }) => (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
        <select
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 transition-all appearance-none"
            {...props}
        >
            {children}
        </select>
    </div>
);

export default Select;
