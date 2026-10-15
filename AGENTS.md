# AGENTS.md - Guías de Desarrollo para Codificación Agéntica

Este archivo contiene guías para agentes que trabajan en este repositorio multi-proyecto.

## Idioma

- **Prioriza el español** en comentarios, mensajes de commit, y documentación
- Usa inglés para código, nombres de variables, funciones y mensajes de error técnicos
- Los mensajes de error pueden ser en español para mejor comprensión del usuario

## Uso de Skills Personalizadas

Cuando realices tareas específicas, carga la skill apropiada:

- **Diseño UI/UX**: Para tareas de interfaz, diseño visual, experiencia de usuario
  ```bash
  Carga la skill "ui-ux-designer" antes de trabajar en componentes de interfaz
  ```
- **Documentación**: Para crear o mejorar documentación técnica
  ```bash
  Carga la skill "documentation-writer" antes de escribir documentación
  ```
- **Búsqueda de habilidades**: Para descubrir funcionalidades adicionales
  ```bash
  Carga la skill "find-skills" si necesitas alguna capacidad específica
  ```

## Estructura del Repositorio

```
edanos-app/
├── backend/       # Express.js + Prisma (API REST, PostgreSQL) — núcleo compartido
├── frontendpc/    # React + Vite + TypeScript + Tailwind v4 (EDANOS WEB)
├── edan1.2/       # Expo ~54 (EDANOS APP - evaluación de campo)
├── satos/         # Expo ~54 (alerta temprana comunitaria)
└── hero/          # Expo ~54 (respuesta táctica de funcionarios)
```

**Proyectos activos principales**: `frontendpc`, `backend`, `edan1.2`

## Comandos de Build, Lint y Pruebas

### frontendpc (React + Vite + TypeScript)
```bash
cd frontendpc
npm run dev          # Iniciar servidor de desarrollo
npm run build       # Build de producción
npm run lint        # Ejecutar ESLint
npm run preview     # Previsualizar build de producción
```

### backend (Express.js + Prisma)
```bash
cd backend
npm run dev         # Iniciar con nodemon
npm run start       # Iniciar producción
npm run seed        # Ejecutar sembrado de base de datos
# No hay framework de pruebas configurado
```

### satos (Expo)
```bash
cd satos
npm start           # Iniciar Expo
npm run android     # Ejecutar en Android
npm run ios         # Ejecutar en iOS
npm run lint        # Ejecutar ESLint
```

### hero (Expo)
```bash
cd hero
npm start           # Iniciar Expo
npm run android     # Ejecutar en Android
npm run ios         # Ejecutar en iOS
```

## Guías de Estilo de Código

### JavaScript (backend)

- Usa tabs (4 espacios), comillas simples, siempre punto y coma, sin comas finales
- Ancho de línea: 100 caracteres
- Usa try/catch con async/await, lanza errores descriptivos

```javascript
const getUser = async (id) => {
	const user = await db.user.findUnique({ where: { id } })
	return user
}
```

### TypeScript (frontendpc, satos, hero)

- Activa modo estricto, evita `any`, usa tipos de retorno explícitos
- Prefiere interfaces sobre types para objetos
- Agrupa imports: externo → interno → relativo
- Sin default exports para componentes

```typescript
interface UserProfile {
	id: string
	name: string
	email: string
}

export const getUserProfile = async (id: string): Promise<UserProfile> => {
	const res = await fetch(`/api/users/${id}`)
	if (!res.ok) throw new Error('Failed to fetch user profile')
	return res.json()
}
```

### React/React Native

- Componentes funcionales con hooks
- Mantén componentes pequeños y enfocados
- Extrae lógica reusable a custom hooks
- Usa React Context para estado global, useState para estado local
- Memoiza con useMemo, usa useCallback para props

### CSS/Tailwind (frontendpc usa v4)

- Usa clases utilitarias
- Usa cva (class-variance-authority) + tailwind-merge

```typescript
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva('inline-flex items-center justify-center rounded-md', {
	variants: {
		variant: { default: 'bg-primary hover:bg-primary/90', destructive: 'bg-destructive' },
		size: { default: 'h-10 px-4', sm: 'h-9 px-3' }
	},
	defaultVariants: { variant: 'default', size: 'default' }
})
```

## Base de Datos (Prisma)

```bash
cd backend
npx prisma migrate dev --name nombre_migracion  # Crear migración
npx prisma db push              # Sincronizar schema sin migrar
npx prisma studio              # Explorador visual de DB
npm run seed                   # Ejecutar sembrado
```

- Usa transacciones para operaciones multi-paso
- Valida input con Zod
- Usa consultas tipo-seguras de Prisma

## Variables de Ambiente

Crea `.env` desde `.env.example`. Nunca comitees secretos.

## Problemas Comunes

- **Expo**: Ejecuta `npx expo install` después de agregar dependencias
- **Tailwind v4**: frontendpc usa `@tailwindcss/vite` plugin

## Convenciones Git

- Usa mensajes de commit significativos
- Crea ramas de features: `feature/descripcion`
- Ejecuta lint antes de commitear (lint-staged en backend)
