import React from 'react';
import {
    Settings, Layers, Plus, Palette, ArrowDownCircle, ArrowUpCircle, Trash2, RefreshCw, Play
} from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import CategoryIcon from '../ui/CategoryIcon';
import { ICON_MAP } from '../../constants/icons';

const SettingsPanel = ({
    categories,
    newCat,
    setNewCat,
    handleAddCategory,
    handleDeleteCategory,
    handleRunTests
}) => {
    return (
        <div className="space-y-6 no-print">
            <div className="flex justify-between items-center text-white mb-2">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="text-emerald-300" /> Configurações
                </h2>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-emerald-600" /> Gerenciar Categorias
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-wider">Nova Categoria</h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                        <div className="md:col-span-4">
                            <Input label="Nome" placeholder="Ex: Mercado, Carro..." value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <Select label="Tipo" value={newCat.type} onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}>
                                <option value="expense">Saída (-)</option>
                                <option value="income">Entrada (+)</option>
                            </Select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Ícone</label>
                            <div className="grid grid-cols-6 gap-1 h-20 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1">
                                {Object.keys(ICON_MAP).map(iconKey => (
                                    <button key={iconKey} onClick={() => setNewCat({ ...newCat, icon: iconKey })} className={`flex items-center justify-center h-8 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${newCat.icon === iconKey ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`} type="button" title={iconKey}>
                                        <CategoryIcon iconName={iconKey} size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Cor</label>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full">
                                    <input type="color" value={newCat.color} onChange={(e) => setNewCat({ ...newCat, color: e.target.value })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                    <div className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center px-3 gap-2 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm" style={{ backgroundColor: newCat.color }} />
                                        <Palette size={16} className="text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <Button onClick={handleAddCategory} className="w-full h-[42px]"><Plus size={20} /></Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-rose-500 mb-3 flex items-center gap-2"><ArrowDownCircle size={16} /> Categorias de Despesa</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {categories.filter(c => c.type === 'expense').map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                                            <CategoryIcon iconName={cat.icon} size={16} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-500 mb-3 flex items-center gap-2"><ArrowUpCircle size={16} /> Categorias de Receita</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {categories.filter(c => c.type === 'income').map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                                            <CategoryIcon iconName={cat.icon} size={16} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-400 hover:text-rose-500 p-1"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><RefreshCw size={20} className="text-indigo-600" /> Diagnóstico do Sistema</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Execute uma verificação automática para garantir que todos os cálculos de saldo e conversão de moeda estão funcionando corretamente.</p>
                    <Button onClick={handleRunTests} variant="secondary" className="flex items-center gap-2"><Play size={16} /> Executar Verificação de Integridade</Button>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPanel;
