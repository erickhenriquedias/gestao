import React from 'react';

const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200 ${className}`}>
        {children}
    </div>
);

export default Card;
