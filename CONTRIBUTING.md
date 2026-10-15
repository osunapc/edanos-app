# Contribuyendo a EDANOS

¡Gracias por tu interés en contribuir a EDANOS! Este documento proporciona pautas para contribuir al proyecto.

## 🎯 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y colaborativo.

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. **Título descriptivo** del problema
2. **Pasos para reproducir** el error
3. **Comportamiento esperado** vs **comportamiento actual**
4. **Capturas de pantalla** si aplica
5. **Información del entorno:**
   - SO (Windows, Linux, macOS)
   - Versión de Node.js
   - Versión del navegador (si aplica)
   - Versión de la app móvil

**Plantilla de Issue:**

```markdown
## Descripción del Bug

[Describe qué salió mal]

## Pasos para Reproducir

1. Ir a...
2. Hacer clic en...
3. Ver error

## Comportamiento Esperado

[Qué debería pasar]

## Comportamiento Actual

[Qué pasa actualmente]

## Capturas de Pantalla

[Si aplica]

## Entorno

- SO: Windows 11
- Node: 18.17.0
- Navegador: Chrome 120
```

### Sugerir Mejoras

Para sugerir nuevas funcionalidades:

1. Verifica que no exista ya un issue similar
2. Describe claramente la funcionalidad
3. Explica el caso de uso y beneficios
4. Opcionalmente, propón una implementación

**Plantilla de Feature Request:**

```markdown
## Funcionalidad Propuesta

[Descripción breve]

## Problema que Resuelve

[¿Qué problema soluciona?]

## Solución Propuesta

[¿Cómo funcionaría?]

## Alternativas Consideradas

[¿Hay otras formas de hacerlo?]

## Beneficios

- Beneficio 1
- Beneficio 2
```

### Pull Requests

#### Proceso

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b bugfix/nombre-descriptivo
   ```
3. **Haz tus cambios** siguiendo las guías de estilo
4. **Escribe tests** si es aplicable
5. **Verifica que todo funcione:**
   ```bash
   npm run test
   npm run lint
   ```
6. **Commit** tus cambios:
   ```bash
   git commit -m "feat: agrega nueva funcionalidad X"
   # o
   git commit -m "fix: corrige problema con Y"
   ```
7. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
8. **Abre un Pull Request** con descripción detallada

#### Guías para el PR

- **Título claro** que describa el cambio
- **Descripción detallada** de qué y por qué
- **Referencias** a issues relacionados (#123)
- **Capturas** si hay cambios visuales
- **Tests** pasando
- **Sin conflictos** con main

**Plantilla de PR:**

```markdown
## Descripción

[Qué cambia este PR]

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Relacionado con

Fixes #123
Relates to #456

## Checklist

- [ ] El código sigue las guías de estilo
- [ ] He revisado mi propio código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Los tests pasan
- [ ] No hay conflictos

## Capturas de Pantalla

[Si aplica]
```

## 📝 Guías de Estilo

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: agrega nueva funcionalidad
fix: corrige un bug
docs: cambios en documentación
style: formato, punto y coma, etc.
refactor: refactorización de código
test: agregar tests
chore: cambios en build, dependencies, etc.
```

**Ejemplos:**

```bash
feat(mobile): agrega selector de eventos en evaluación
fix(web): corrige carga de mapa en dashboard
docs: actualiza README con instrucciones de Docker
refactor(backend): mejora estructura de controladores
```

### JavaScript/TypeScript

- **Indentación**: 2 espacios
- **Comillas**: Simples `'texto'`
- **Punto y coma**: Usar siempre
- **Nombres**: camelCase para variables, PascalCase para componentes
- **Comentarios**: JSDoc para funciones públicas

```typescript
/**
 * Crea una nueva evaluación EDAN
 * @param {FormData} data - Datos del formulario
 * @returns {Promise<Evaluation>} La evaluación creada
 */
async function createEvaluation(data: FormData): Promise<Evaluation> {
	// Implementación
}
```

### React/React Native

- **Componentes**: Un componente por archivo
- **Hooks**: al inicio del componente
- **Props**: TypeScript interfaces
- **Estado**: Preferir hooks sobre clases

```typescript
interface ButtonProps {
	label: string;
	onPress: () => void;
	disabled?: boolean;
}

export function Button({ label, onPress, disabled = false }: ButtonProps) {
	return (
		<TouchableOpacity onPress={onPress} disabled={disabled}>
			<Text>{label}</Text>
		</TouchableOpacity>
	);
}
```

## 🧪 Testing

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontendpc
npm run test
```

### Escribir Tests

```javascript
describe("EvaluationController", () => {
	it("should create a new evaluation", async () => {
		const data = {
			/* ... */
		};
		const result = await createEvaluation(data);
		expect(result).toHaveProperty("id");
	});
});
```

## 📁 Estructura de Directorios

```
nueva-feature/
├── components/           # Componentes React
│   └── EventSelector.tsx
├── hooks/               # Custom hooks
│   └── useEvents.ts
├── services/            # Servicios de API
│   └── eventService.ts
├── types/               # Definiciones TypeScript
│   └── event.ts
└── __tests__/           # Tests
    └── EventSelector.test.tsx
```

## 🔄 Workflow de Desarrollo

1. **Selecciona un issue** o crea uno nuevo
2. **Asígnate** el issue
3. **Crea rama** desde `main`
4. **Desarrolla** la funcionalidad
5. **Testing local** completo
6. **Push** y abre PR
7. **Code review** por maintainers
8. **Merge** a main

## 💬 Comunicación

- **Issues**: Para bugs y features
- **Pull Requests**: Para revisión de código
- **Discussions**: Para preguntas y discusiones

## 🎖️ Reconocimiento

Los contribuidores serán reconocidos en:

- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Release notes
- Documentación del proyecto

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir:

1. Revisa issues existentes
2. Consulta la documentación
3. Abre un issue con la etiqueta `question`

---

## 🙏 Agradecimientos

Gracias por contribuir a mejorar EDANOS y ayudar a modernizar la gestión de emergencias en Venezuela.

**Proyecto creado por:** Gabriel Osuna  
**Maintainers:** [Lista de maintainers]

---

**Última actualización:** Noviembre 2024
