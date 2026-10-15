import jwt from 'jsonwebtoken';

const tokenSecret = process.env.JWT_SECRET_KEY;

function createAccessToken(user) {
	const expiration = new Date();
	expiration.setHours(expiration.getHours() + 12);
	return jwt.sign(_tokenPayLoad(user, expiration), tokenSecret);
}

function createRefreshToken(user) {
	const expiration = new Date();
	expiration.setMonth(expiration.getMonth() + 1);
	return jwt.sign(_tokenPayLoad(user, expiration), tokenSecret);
}

function decodeToken(token) {
	// Verifica y decodifica el token usando la clave secreta
	// Lanza si el token no es válido
	return jwt.verify(token, tokenSecret);
}

function _tokenPayLoad(user, expiration, tokenType = 'token') {
	return {
		tokenType,
		user,
		iat: new Date().getTime(),
		exp: expiration.getTime()
	};
}

export default {
	createAccessToken,
	createRefreshToken,
	decodeToken
};
