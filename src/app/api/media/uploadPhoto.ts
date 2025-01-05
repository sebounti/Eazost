export async function upload(userId: string, photo: File): Promise<string> {
  // Logique d'upload vers Cloudinary ou autre service
  const formData = new FormData();
  formData.append('file', photo);
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  return data.secure_url;
}
