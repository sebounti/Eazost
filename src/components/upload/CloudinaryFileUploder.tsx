import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IoImageOutline } from "react-icons/io5";


interface CloudinaryFileUploaderProps {
	uploadPreset: string;
  	onUploadSuccess: (url: string) => void;
  	disabled?: boolean;
}

const CloudinaryFileUploader = ({ uploadPreset, onUploadSuccess, disabled = false }: CloudinaryFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onUploadSuccess?.(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id="cloudinary-upload"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
      />
      <Button
        type="button"
        onClick={() => document.getElementById('cloudinary-upload')?.click()}
        disabled={disabled}
        className="w-full bg-amber-300 text-slate-900 rounded-xl hover:bg-amber-400 flex items-center justify-center gap-2"
      >
		{isUploading ? 'Téléchargement en cours...' : 'Ajouter une photo'}
        <IoImageOutline size={50} />
      </Button>
    </div>
  );
};

export default CloudinaryFileUploader;
