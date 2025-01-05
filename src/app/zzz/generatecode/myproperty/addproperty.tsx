
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddProperty({ addProperty }: { addProperty: (property: any) => void }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProperty = {
      id: Date.now(), // Utilise l'ID pour différencier les propriétés
      title,
      description,
      image,
    };
    addProperty(newProperty);
    router.push('/'); // Redirige vers le tableau de bord après ajout
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center p-4">
      <input
        type="text"
        placeholder="Titre de la propriété"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setImage(file || null);
        }}
        className="mb-4"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Ajouter la propriété
      </button>
    </form>
  );
}

