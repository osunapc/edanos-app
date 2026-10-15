import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { lazy, Suspense } from "react";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { SatosPage } from "./pages/SatosPage";

// Eager load: Critical pages for initial render
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PoliticasDePrivacidad from "./pages/politicasDePrivacidad";
import EliminarCuenta from "./pages/EliminarCuenta";
import BiografiaGabrielOsuna from "./pages/BiografiaGabrielOsuna";
import ProyectoEdanos from "./pages/proyectos/ProyectoEdanos";
import ProyectoSatos from "./pages/proyectos/ProyectoSatos";
import ProyectoEdanosSchool from "./pages/proyectos/ProyectoEdanosSchool";
import ProyectoPlataformaWeb from "./pages/proyectos/ProyectoPlataformaWeb";
import ProyectoApiEdanos from "./pages/proyectos/ProyectoApiEdanos";
import ProyectoHeroApp from "./pages/proyectos/ProyectoHeroApp";
import ProyectoEdos from "./pages/proyectos/ProyectoEdos";

// Lazy load: Protected pages (only load when needed)
const Register = lazy(() => import("./pages/Register"));
const GragicosEdan = lazy(() => import("./pages/GraficosEdan"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const AnaliticasEducacion = lazy(
	() => import("./pages/educacion/AnaliticasEducacion"),
);
const Solicitudes = lazy(() => import("./pages/Solicitudes"));

// Loading fallback component
const PageLoader = () => (
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
	</div>
);

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Toaster position="top-right" reverseOrder={false} />
				<main className="content-container mx-auto px-0 md:px-0">
					<Navbar />
					<Suspense fallback={<PageLoader />}>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/login" element={<Login />} />
							<Route
								path="/gabriel-osuna"
								element={<BiografiaGabrielOsuna />}
							/>
							<Route path="/politicas" element={<PoliticasDePrivacidad />} />
							<Route path="/eliminar-cuenta" element={<EliminarCuenta />} />
							<Route path="/proyectos/edanos" element={<ProyectoEdanos />} />
							<Route path="/proyectos/satos" element={<ProyectoSatos />} />
							<Route path="/proyectos/edanos-school" element={<ProyectoEdanosSchool />} />
							<Route path="/proyectos/plataforma-web" element={<ProyectoPlataformaWeb />} />
							<Route path="/proyectos/api-edanos" element={<ProyectoApiEdanos />} />
							<Route path="/proyectos/hero-app" element={<ProyectoHeroApp />} />
							<Route path="/proyectos/edos" element={<ProyectoEdos />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/usuarios" element={<Usuarios />} />
								<Route path="/graficos" element={<GragicosEdan />} />
								<Route path="/analiticas" element={<AnaliticasEducacion />} />
								<Route path="/solicitudes" element={<Solicitudes />} />
								<Route path="/register" element={<Register />} />
								<Route path="/user/:id" element={<Register />} />
								<Route path="/satos" element={<SatosPage />} />
							</Route>
						</Routes>
					</Suspense>
					{/* Botón flotante de WhatsApp - visible en todas las páginas */}
					<WhatsAppButton
						phoneNumber="584147353142"
						message="Hola, me gustaría obtener más información sobre EDANOS"
					/>
				</main>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
