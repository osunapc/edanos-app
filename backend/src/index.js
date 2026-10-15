import 'dotenv/config'; // Cargar variables de entorno PRIMERO
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import Sockets from './sockets.js';

// Import routes

// import login from "./routes/login/login.js";
import usuarios from './routes/usuarios/usuarios.js';
import edan from './routes/edan/edan.js';
import registration from './routes/registration/registration.js';
import eventos from './routes/eventos/eventos.js'; // ⭐ NUEVO
import satos from './routes/satos/satos.js';
import funcionarios from './routes/funcionarios/funcionarios.js';
import { ensureSuperadmin } from '../scripts/ensureSuperadmin.js';

// dotenv.config(); // Eliminado, se carga arriba
const port = process.env.PORT ?? 4500;

const app = express();
const server = createServer(app);

const allowedOrigins = [
	'https://edanosapp.site',
	'https://edanos.netlify.app',
	'http://localhost:5173',
	'http://localhost:8081'
];

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Configure Socket.IO with CORS
const io = new Server(server, {
	connectionStateRecovery: {},
	cors: corsOptions
});

// ⭐ NUEVO: Middleware para inyectar io en req
app.use((req, res, next) => {
	req.io = io;
	next();
});

// Expose routes

// app.use("/api", login);
app.use('/api', usuarios);
app.use('/api', edan);
app.use('/api', registration); // Rutas de registro público
app.use('/api/eventos', eventos); // ⭐ NUEVO: Rutas de eventos
app.use('/api', satos);
app.use('/api', funcionarios);

Sockets(io);

ensureSuperadmin();

server.listen(port, () => console.log('Escuchando en el puerto', port));
