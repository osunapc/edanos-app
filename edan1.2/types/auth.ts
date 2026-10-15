export interface User {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  ubicacion: string;
  telefono: string;
  rol: 'superadmin' | 'admin' | 'user';
  codigo: string;
  tipoInstitucion?: string;
  token: string;
}

export interface LoginCredentials {
  cedula: string;
  contrasena: string;
}

import { Socket } from 'socket.io-client';
import { Evento } from './evaluation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  socket: Socket | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  eventoActivo: Evento | null;
  selectEvento: (evento: Evento) => Promise<void>;
  clearEvento: () => Promise<void>;
}