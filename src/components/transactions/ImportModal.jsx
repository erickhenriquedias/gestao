import React, { useState, useRef } from 'react';
import { Upload, X, Check, FileText, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { parseOFX } from '../../utils/ofxParser';
import { formatCurrency } from '../../utils/formatters';

const ImportModal = ({ isOpen, onClose, onImport, categories }) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileValues, setFileValues] = useState([]);
    const [fileName, setFileName] = useState('');
    const [step, setStep] = useState('upload'); // 'upload' | 'preview'
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.name.toLowerCase().endsWith('.ofx')) {
            alert('Por favor, selecione um arquivo .OFX válido.');
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const parsed = parseOFX(content);
            setFileValues(parsed);
            setStep('preview');
        };
        reader.readAsText(file);
    };

    const handleCategoryChange = (index, newCatId) => {
        const newValues = [...fileValues];
        newValues[index].category = newCatId;
        setFileValues(newValues);
    };

    const handleImport = () => {
        // Filter out any explicitly skipped items if we added that feature, 
        // for now import all.
        onImport(fileValues);
        onClose();
        // Reset state
        setFileValues([]);
        setFileName('');
        setStep('upload');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Upload size={24} className="text-emerald-600" />
                        Importar Extrato (OFX)
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'upload' ? (
                        <div
                            className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-colors ${dragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <FileText size={48} className={`mb-4 ${dragActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Arraste seu arquivo OFX aqui</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">ou clique para selecionar do computador</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".ofx"
                                onChange={handleFileChange}
                            />
                            <Button onClick={() => fileInputRef.current?.click()}>
                                Selecionar Arquivo
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                    <Check size={20} />
                                    <span className="font-medium">Arquivo lido com sucesso: {fileName}</span>
                                </div>
                                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">{fileValues.length} lançamentos</span>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Data</th>
                                            <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Descrição</th>
                                            <th className="p-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Valor</th>
                                            <th className="p-3 font-semibold text-slate-600 dark:text-slate-300">Categoria (Sugerida)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {fileValues.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 text-slate-600 dark:text-slate-400">{new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                                                <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{item.description}</td>
                                                <td className={`p-3 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(item.amount)}
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={item.category}
                                                        onChange={(e) => handleCategoryChange(idx, e.target.value)}
                                                        className="w-full p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    {step === 'preview' && (
                        <Button onClick={handleImport} className="flex items-center gap-2">
                            <Check size={18} /> Confirmar Importação
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
