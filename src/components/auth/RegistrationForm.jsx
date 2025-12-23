import React, { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegistrationForm = ({ user, onComplete }) => {
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        age: '',
        occupation: '',
        nickname: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validação de Nome: Mínimo 3 caracteres
        if (formData.name.length < 3) {
            setError('O nome deve ter pelo menos 3 caracteres.');
            return;
        }

        // Validação de Idade: Entre 12 e 120 anos (Range realista para app financeiro)
        const ageNum = parseInt(formData.age);
        if (!ageNum || ageNum < 12 || ageNum > 120) {
            setError('Por favor, insira uma idade válida (entre 12 e 120 anos).');
            return;
        }

        onComplete(formData);
    };

    const handleNameChange = (e) => {
        const val = e.target.value;
        // Regex: Permite apenas letras (com acentos) e espaços. Nega números e símbolos.
        if (/^[a-zA-Z\u00C0-\u00FF\s]*$/.test(val)) {
            setFormData({ ...formData, name: val });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans">
            <Card className="max-w-md w-full p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
                            <User size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Complete seu Perfil</h2>
                    <p className="text-slate-500 dark:text-slate-400">Queremos te conhecer melhor para personalizar sua experiência.</p>
                </div>

                {error && (
                    <div className="bg-rose-100 text-rose-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome Completo *</label>
                        <input
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="Seu nome (apenas letras)"
                        />
                    </div>

                    <Input
                        label="Idade *"
                        type="number"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        required
                        placeholder="Ex: 25"
                        min="12"
                        max="120"
                    />
                    <Input
                        label="Profissão / Trabalho (Opcional)"
                        value={formData.occupation}
                        onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="Ex: Designer, Engenheiro..."
                    />
                    <Input
                        label="Apelido (Opcional)"
                        value={formData.nickname}
                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                        placeholder="Como quer ser chamado?"
                    />

                    <Button type="submit" className="w-full mt-6 h-12 text-lg">
                        Concluir Cadastro
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default RegistrationForm;
