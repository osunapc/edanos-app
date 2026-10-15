/**
 * Genera una contraseña aleatoria segura de 12 caracteres
 */
export const generateRandomPassword = () => {
	const length = 12;
	const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
	let password = '';

	// Asegurar al menos un carácter de cada tipo
	password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Mayúscula
	password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
	password += '0123456789'[Math.floor(Math.random() * 10)]; // Número
	password += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Especial

	// Completar el resto
	for (let i = password.length; i < length; i++) {
		password += charset[Math.floor(Math.random() * charset.length)];
	}

	// Mezclar los caracteres
	return password
		.split('')
		.sort(() => Math.random() - 0.5)
		.join('');
};
