'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Types pour les résultats Cloudinary
interface CloudinaryInfo {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format: string;
  resource_type: string;
}

interface CloudinaryResult {
  event: string | undefined;
  info: CloudinaryInfo;
}

// Props du composant
interface CloudinaryButtonProps {
  onUpload?: (url: string) => void;
  onError?: (error: Error) => void;
  uploadPreset?: string;
  maxFileSize?: number;
  allowedFormats?: string[];
  className?: string;
  buttonText?: string;
}

const CloudinaryButton = ({
  onUpload,
  onError,
  uploadPreset = "info_card_images",
  maxFileSize = 10000000, // 10MB par défaut
  allowedFormats = ['image/jpeg', 'image/png'],
  buttonText = "Télécharger une image",
  className
}: CloudinaryButtonProps) => {

  const handleUpload = useCallback((result: CloudinaryUploadWidgetResults) => {
    try {
      if (result.event !== "success") return;

      if (!result.info || typeof result.info === 'string') return;
      const url = result.info.secure_url;

      // Validation du format
      if (!allowedFormats.includes(result.info.format)) {
        throw new Error('Format de fichier non supporté');
      }

      if (onUpload) {
        onUpload(url);
        toast.success('Image téléchargée avec succès');
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error('Erreur lors du téléchargement');
      console.error('Erreur upload:', error);
    }
  }, [onUpload, onError, allowedFormats]);

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      onSuccess={handleUpload}
      options={{
        maxFileSize,
        resourceType: "image",
        clientAllowedFormats: allowedFormats,
        sources: ['local', 'camera'],
        multiple: false,
        cookiePolicy: 'none',
        useSecureProtocol: true,
        forceIframe: true,
        crossOrigin: "anonymous",
        sameOrigin: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            sourceBg: "#F4F5F7",
            windowBorder: "#90A0B3",
            tabIcon: "#FFA500",
            inactiveTabIcon: "#BCC4D0",
            menuIcons: "#5A616A",
            link: "#FFA500",
            action: "#FF620C",
            inProgress: "#0078FF",
            complete: "#20B832",
            error: "#EA4335",
            textDark: "#000000",
            textLight: "#FFFFFF"
          }
        }
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
          variant="outline"
          className={`bg-amber-500 text-white px-4 py-2 rounded-md
            hover:bg-white hover:text-amber-500 hover:border
            hover:border-amber-500 ${className}`}
        >
          {buttonText}
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default CloudinaryButton;
