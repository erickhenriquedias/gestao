import React from 'react';
import { Plus, CalendarDays, DollarSign, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const SubscriptionForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    categories,
    isEditing = false,
    onCancel
}) => {
    return (
        <Card className="p-6 w-full mb-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Plus size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    {isEditing ? 'Editar Assinatura' : 'Nova Assinatura'}
                </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nome do Serviço"
                        placeholder="Ex: Netflix, Academia, Internet"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="relative">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                            Categoria
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 appearance-none"
                        >
                            {categories.filter(c => c.type === 'expense').map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Valor Mensal"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="relative">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                            Dia do Vencimento
                        </label>
                        <select
                            name="billingDay"
                            value={formData.billingDay}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 appearance-none"
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>Dia {day}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1 h-12 text-lg">
                        {isEditing ? 'Salvar Alterações' : 'Adicionar Assinatura'}
                    </Button>
                    {isEditing && (
                        <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6">
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
};

export default SubscriptionForm;
