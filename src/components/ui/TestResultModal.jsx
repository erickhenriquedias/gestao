import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Button from './Button';

const TestResultModal = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm no-print">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Relatório de Integridade</h3>
                <div className="flex gap-4 mb-4">
                    <div className="text-emerald-600 font-bold">Passou: {result.passed}</div>
                    <div className="text-rose-600 font-bold">Falhou: {result.failed}</div>
                </div>
                <div className="space-y-2 text-sm">
                    {result.logs.map((log, idx) => (
                        <div key={idx} className={`p-2 rounded border ${log.status === 'pass' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                            {log.status === 'pass' ? <CheckCircle2 size={14} className="inline mr-2" /> : <XCircle size={14} className="inline mr-2" />}
                            {log.message}
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};

export default TestResultModal;
