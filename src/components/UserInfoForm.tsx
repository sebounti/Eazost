'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UsersInfoSchema } from '@/validation/UsersInfoSchema';
import { z } from 'zod';

type UserFormData = z.infer<typeof UsersInfoSchema>;

export default function UserInfoForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<UserFormData>>({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        address_line1: '',
        address_line2: '',
        city: '',
        zipcode: '',
        country: '',
        phone_number: '',
        profile_image_url: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/users/${session.user.id}/profile`);
                    if (response.ok) {
                        const data = await response.json();
                        setFormData(data);
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    toast.error('Erreur lors du chargement du profil');
                }
            }
        };

        fetchUserInfo();
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        try {
            // Debug logs
            console.log('Session user ID:', session.user.id);
            console.log('Session user ID type:', typeof session.user.id);

            // Préparation des données pour la validation
            const dataToValidate = {
                ...formData,
                users_id: session.user.id,
                profile_image_url: formData.profile_image_url || undefined
            };

            console.log('Data to validate:', dataToValidate);

            // Validation avec Zod
            const validatedData = UsersInfoSchema.parse(dataToValidate);

            const response = await fetch(`/api/users/${session.user.id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData)
            });

            if (response.ok) {
                toast.success('Profil mis à jour avec succès');
                router.refresh();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach(err => {
                    toast.error(err.message);
                });
            } else {
                console.error('Erreur:', error);
                toast.error('Une erreur est survenue');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                    placeholder="Adresse principale"
                />
            </div>

            <div>
                <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    placeholder="Complément d'adresse (optionnel)"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ville</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Code postal</label>
                    <input
                        type="text"
                        value={formData.zipcode}
                        onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pays</label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
                Sauvegarder les modifications
            </button>
        </form>
    );
}
