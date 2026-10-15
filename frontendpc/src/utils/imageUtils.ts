const _imageUrlToBase64Single = async (url: string): Promise<string | null> => {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					console.error(`Failed to fetch image ${url}: ${response.status} ${response.statusText}`);
					return null;
				}
				const blob = await response.blob();
	
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						const base64data = reader.result as string;
	
						// Check if the image is WebP and convert if necessary
						if (blob.type === "image/webp") {
							const img = new Image();
							img.onload = () => {
								const canvas = document.createElement("canvas");
								canvas.width = img.width;
								canvas.height = img.height;
								const ctx = canvas.getContext("2d");
								ctx?.drawImage(img, 0, 0);
								// Convert to JPEG, which is widely supported
								resolve(canvas.toDataURL("image/jpeg"));
							};
							img.onerror = (e) => {
								console.error(`Error loading image for WebP conversion from ${url}:`, e);
								reject(null);
							};
							img.src = base64data; // Load the WebP image from its Base64 representation
						} else {
							resolve(base64data);
						}
					};
					reader.onerror = (e) => {
						console.error(`FileReader error for ${url}:`, e);
						reject(null);
					};
					reader.readAsDataURL(blob);
				});
			} catch (error) {
				console.error(
					`Error no controlado al convertir la imagen a Base64 para ${url}:`,
					error
				);
				return null;
			}};

const imageUrlToBase64 = async (
	urls: string | string[]
): Promise<string | string[] | null> => {
	if (Array.isArray(urls)) {
		const results = await Promise.all(urls.map((url) => _imageUrlToBase64Single(url)));
		return results.filter((result) => result !== null) as string[];
	} else {
		return _imageUrlToBase64Single(urls);
	}
};

export { imageUrlToBase64 };

