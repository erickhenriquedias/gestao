import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmationModal = ({ isOpen, message, onClose, onConfirm, title = "Excluir?" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 no-print">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform scale-100 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-rose-600 text-white font-medium hover:bg-rose-700 rounded-lg shadow-lg flex items-center gap-2">
                        <Trash2 size={16} /> Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
