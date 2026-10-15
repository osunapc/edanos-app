import jwt from 'jsonwebtoken';

export const autenticacion = (req, res, next) => {
	let token = null;

	// Check for token in Authorization header
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
	}

	// If not in header, check for token in cookie
	if (!token && req.headers.cookie) {
		const cookies = req.headers.cookie.split('; ').reduce((acc, cookie) => {
			const [name, value] = cookie.split('=');
			acc[name] = value;
			return acc;
		}, {});
		token = cookies.token;
	}

	if (!token) {
		console.log('Auth middleware: No token found', {
			hasAuthHeader: !!req.headers.authorization,
			hasCookie: !!req.headers.cookie,
			origin: req.headers.origin
		});
		return res.status(401).json({ error: 'No autorizado', reason: 'token_not_found' });
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
		if (error) {
			console.log('Auth middleware: Token verification failed', error.message);
			return res.status(401).json({ error: 'No autorizado', reason: 'invalid_token' });
		}

		req.user = decoded;
		next();
	});
};
