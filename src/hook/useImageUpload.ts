import { useState } from 'react';

export function useImageUpload() {
  const [profileImage, setProfileImage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadImage = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setIsUploading(true);
      setError(null);
      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: base64Image }),
        });

        const data = await response.json();
        if (data.success) {
          setProfileImage(data.uploadResult.secure_url);
        } else {
          console.error("Upload échoué :", data.message);
          setError(data.message);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        setError('Erreur lors de l\'upload');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return { profileImage, uploadImage, error, isUploading };
}
