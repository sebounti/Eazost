



export const uploadFileToServer = async (file: File): Promise<string | null> => {
	const fileToBase64 = (file: File): Promise<string> => {
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	  });
	};

	try {
	  const response = await fetch('/api/media/upload', {
		method: 'POST',
		body: JSON.stringify({ file: await fileToBase64(file) }),
		headers: { 'Content-Type': 'application/json' },
	  });

	  const data = await response.json();
	  return data.url || null;
	} catch (error) {
	  console.error('Erreur lors de l\'upload :', error);
	  return null;
	}
  };
