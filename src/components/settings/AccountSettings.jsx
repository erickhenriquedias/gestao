import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AccountSettings = ({ user, userProfile, setUserProfile, onSave }) => {
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        cpf: '',
        phone: '',
        profession: '',
        bio: '',
        avatarUrl: user?.photoURL || '',
        social: {
            instagram: '',
            linkedin: '',
            twitter: ''
        }
    });

    useEffect(() => {
        if (userProfile) {
            setFormData(prev => ({
                ...prev,
                ...userProfile,
                social: { ...prev.social, ...(userProfile.social || {}) }
            }));
        }
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                social: { ...prev.social, [socialKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="text-emerald-500" /> Minha Conta
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coluna da Esquerda - Avatar e Info Básica */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 mx-auto bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-slate-400" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">
                                    <Camera size={18} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{formData.displayName || 'Usuário'}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{formData.email}</p>
                        </Card>

                        <Card className="p-6">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                                <LinkIcon size={18} /> Redes Sociais
                            </h4>
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-slate-400"><Instagram size={16} /></div>
                                    <input
                                        type="text"
                                        name="social.instagram"
                                        value={formData.social.instagram}
                                        onChange={handleChange}
                                        placeholder="Instagram"
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-slate-400"><Linkedin size={16} /></div>
                                    <input
                                        type="text"
                                        name="social.linkedin"
                                        value={formData.social.linkedin}
                                        onChange={handleChange}
                                        placeholder="LinkedIn"
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 text-slate-400"><Twitter size={16} /></div>
                                    <input
                                        type="text"
                                        name="social.twitter"
                                        value={formData.social.twitter}
                                        onChange={handleChange}
                                        placeholder="X / Twitter"
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Coluna da Direita - Formulário Principal */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">Dados Pessoais</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input label="Nome de Exibição (Apelido)" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Como você quer ser chamado" />
                                </div>
                                <div>
                                    <Input label="CPF (Opcional)" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                                </div>
                                <div>
                                    <Input label="Telefone / Celular" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                                </div>
                                <div>
                                    <Input label="Profissão (Opcional)" name="profession" value={formData.profession} onChange={handleChange} placeholder="Ex: Desenvolvedor, Médico" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio / Sobre</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 dark:text-white"
                                        placeholder="Um pouco sobre você..."
                                    ></textarea>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" className="w-full md:w-auto px-8">
                                <Save size={20} /> Salvar Alterações
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountSettings;
