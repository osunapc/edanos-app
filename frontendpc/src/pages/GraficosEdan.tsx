"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/uiredix/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../components/uiredix/tabs";
import { Button } from "../components/uiredix/button";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { DataTable } from "../components/data-table";
import { getColumns } from "../components/columns";
import { Loader2 } from "lucide-react";
import { Evaluation, GrupoFamiliar, Evento } from "../type/type";
import { FiltroDesplegable } from "../components/filtros/FiltroDesplegable";
import { FiltroDeTexto } from "../components/filtros/FiltroDeTexto";
import { FiltroRangoFecha } from "../components/filtros/FiltroRangoFecha";
import { FiltroRangoNumerico } from "../components/filtros/FiltroRangoNumerico";
import { GrupoFamiliarModal } from "../components/GrupoFamiliarModal";

import { DetalleEdanModal } from "../components/DetalleEdanModal";

import { MapaEdan } from "../components/MapaEdan";

import { COLORS } from "../conf/chartConstants";
import { useEdanData } from "../hooks/useEdanData";
import { useEdanFilters } from "../hooks/useEdanFilters";
import { useUniqueEdanValues } from "../hooks/useUniqueEdanValues";
import { useEdanChartData } from "../hooks/useEdanChartData";
import {
	generatePdfReport,
	generateExcelReport,
	generateFichaPdf,
	generatePlanillaPdf,
} from "../utils/edanExportUtils.tsx";

import { useEventos } from "../hooks/useEventos";
import { SelectorEvento } from "../components/SelectorEvento";
import { CrearEventoModal } from "../components/CrearEventoModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Plus, Archive, Trash2 } from "lucide-react";

export default function GragicosEdan() {
	const { isAuthenticated, user } = useAuth();

	// ⭐ NUEVO: Hook de eventos (mostrar todos, no solo activos)
	const {
		eventos,
		eventoActivo,
		setEventoActivo,
		crearEvento,
		cerrarEvento,
		eliminarEvento,
	} = useEventos(false); // false = mostrar todos los eventos

	// ⭐ MODIFICADO: Pasar eventoActivo.id a useEdanData
	const { data, isLoading, error } = useEdanData(eventoActivo?.id);

	const { filters, handleFilterChange, resetFilters, filteredData } =
		useEdanFilters(data);
	const { uniqueValues } = useUniqueEdanValues(data);
	const {
		kpiData,
		genderData,
		ageData,
		patologiasData,
		municipioData,
		eventoData,
		afectacionesData,
	} = useEdanChartData(filteredData, filters);
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
	const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
	const [isGeneratingFicha, setIsGeneratingFicha] = useState(false);
	const [isGeneratingPlanilla, setIsGeneratingPlanilla] = useState(false);
	const dataRef = useRef<Evaluation[]>([]);

	// Estado para modal de crear evento
	const [isCrearEventoModalOpen, setIsCrearEventoModalOpen] = useState(false);
	const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

	useEffect(() => {
		dataRef.current = data;
	}, [data]);

	const handleGeneratePdf = async () => {
		// Pasar nombre del evento si existe
		const tituloEvento = eventoActivo ? eventoActivo.nombre : undefined;
		await generatePdfReport(filteredData, setIsGeneratingPdf, tituloEvento);
	};

	const handleGenerateExcel = async () => {
		const tituloEvento = eventoActivo ? eventoActivo.nombre : undefined;
		await generateExcelReport(filteredData, setIsGeneratingExcel, tituloEvento);
	};

	const handleGenerateFicha = async () => {
		await generateFichaPdf(filteredData, setIsGeneratingFicha);
	};

	const handleGeneratePlanilla = async () => {
		await generatePlanillaPdf(filteredData, setIsGeneratingPlanilla);
	};

	const handleCrearEvento = async (data: Partial<Evento>): Promise<Evento | null> => {
		try {
			const creado = await crearEvento(data);
			return creado;
		} catch (error) {
			console.error("Error al crear evento:", error);
			throw error;
		}
	};

	const handleCerrarEvento = () => {
		if (!eventoActivo) return;
		setIsConfirmCloseOpen(true);
	};

	const confirmarCerrarEvento = async () => {
		if (!eventoActivo) return;

		try {
			await cerrarEvento(eventoActivo.id);
		} catch (error) {
			console.error("Error al cerrar evento:", error);
			alert("Error al cerrar el evento");
		}
	};

	const handleEliminarEvento = () => {
		if (!eventoActivo) return;
		setIsConfirmDeleteOpen(true);
	};

	const confirmarEliminarEvento = async () => {
		if (!eventoActivo) return;

		try {
			await eliminarEvento(eventoActivo.id);
			setEventoActivo(null); // Limpiar explicitamente en componente también por si acaso
			setIsConfirmDeleteOpen(false);
		} catch (error) {
			console.error("Error al eliminar evento:", error);
			alert("Error al eliminar el evento");
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedGrupo({ grupo: [], jefe: "" });
	};

	const closeDetailModal = () => {
		setIsDetailModalOpen(false);
		setSelectedEvaluation(null);
	};

	const openModal = useCallback(
		(grupo: GrupoFamiliar[], jefe: string | undefined) => {
			setSelectedGrupo({ grupo, jefe });
			setIsModalOpen(true);
		},
		[],
	);

	const openDetailModal = useCallback((evaluation: Evaluation) => {
		setSelectedEvaluation(evaluation);
		setIsDetailModalOpen(true);
	}, []);

	const tableColumns = useMemo(
		() => getColumns(openModal, openDetailModal),
		[openModal, openDetailModal],
	);

	// Modal State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedGrupo, setSelectedGrupo] = useState<{
		grupo: GrupoFamiliar[];
		jefe: string | undefined;
	}>({ grupo: [], jefe: "" });

	// Detail Modal State
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedEvaluation, setSelectedEvaluation] =
		useState<Evaluation | null>(null);

	// Map Modal State
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);

	if (isLoading) {
		return (
			<h1 className="text-white text-center text-5xl mt-32">Cargando...</h1>
		);
	}

	if (!isAuthenticated || user?.rol === "user") {
		console.log("User role:", user?.rol);
		return (
			<h1 className="text-white font-bold text-center mt-32 text-4xl">
				No está autorizado para ver esta página.
			</h1>
		);
	}

	const canManageEvents =
		user?.rol === "admin" ||
		user?.rol === "superadmin" ||
		user?.rol === "coordinador";

	return (
		<div className="dark min-h-screen w-full bg-slate-950 text-white overflow-hidden">
			<GrupoFamiliarModal
				isOpen={isModalOpen}
				onClose={closeModal}
				grupo={selectedGrupo.grupo}
				jefe={selectedGrupo.jefe}
			/>
			<DetalleEdanModal
				isOpen={isDetailModalOpen}
				onClose={closeDetailModal}
				evaluation={selectedEvaluation}
			/>
			<CrearEventoModal
				isOpen={isCrearEventoModalOpen}
				onClose={() => setIsCrearEventoModalOpen(false)}
				onCrear={handleCrearEvento}
			/>
			<ConfirmDialog
				isOpen={isConfirmCloseOpen}
				onClose={() => setIsConfirmCloseOpen(false)}
				onConfirm={confirmarCerrarEvento}
				title="Cerrar Evento"
				description={`¿Está seguro que desea cerrar el evento "${eventoActivo?.nombre}"? Esto lo archivará y dejará de estar activo.`}
				confirmText="Cerrar Evento"
				cancelText="Cancelar"
			/>
			<ConfirmDialog
				isOpen={isConfirmDeleteOpen}
				onClose={() => setIsConfirmDeleteOpen(false)}
				onConfirm={confirmarEliminarEvento}
				title="Eliminar Evento"
				description={`¿Está SEGURO que desea eliminar el evento "${eventoActivo?.nombre}"? Esta acción eliminará TAMBIÉN todas las evaluaciones asociadas y NO se puede deshacer.`}
				confirmText="Eliminar Definitivamente"
				cancelText="Cancelar"
			/>
			<MapaEdan
				isOpen={isMapModalOpen}
				onClose={() => setIsMapModalOpen(false)}
				evaluations={filteredData}
			/>
			<h1 className="text-3xl font-bold mb-6 text-center text-orange-500">
				Dashboard de Evaluaciones EDAN
			</h1>

			{/* ⭐ NUEVO: Sección de Gestión de Eventos */}
			<div className="px-10 mb-6 flex flex-col md:flex-row gap-4 items-end justify-between">
				<SelectorEvento
					eventos={eventos}
					eventoActivo={eventoActivo}
					onEventoChange={setEventoActivo}
				/>

				{canManageEvents && (
					<div className="flex gap-2">
						<Button
							onClick={() => setIsCrearEventoModalOpen(true)}
							className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
						>
							<Plus className="w-4 h-4" />
							Nuevo Evento
						</Button>

						{eventoActivo && (
							<>
								{eventoActivo.estadoEvento === "activo" && (
									<Button
										onClick={handleCerrarEvento}
										variant="outline"
										className="border-red-500/50 text-red-400 hover:bg-red-950 hover:text-red-300 flex items-center gap-2"
									>
										<Archive className="w-4 h-4" />
										Cerrar Evento
									</Button>
								)}

								{eventoActivo.estadoEvento === "cerrado" && (
									<Button
										onClick={handleEliminarEvento}
										variant="outline"
										className="border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400 flex items-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										Eliminar
									</Button>
								)}
							</>
						)}
					</div>
				)}
			</div>

			{isLoading ?
				<div className="flex items-center justify-center h-96">
					<Loader2 className="h-12 w-12 animate-spin text-orange-500" />
					<span className="ml-4 text-xl">Cargando datos...</span>
				</div>
			: error ?
				<div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded text-center">
					<p>Error: {error}</p>
				</div>
			: !eventoActivo ?
				<div className="flex flex-col items-center justify-center h-96 px-10">
					<div className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl p-8 text-center max-w-md">
						<h2 className="text-2xl font-bold text-orange-500 mb-4">
							📋 Selecciona un Evento
						</h2>
						<p className="text-gray-300 text-lg">
							Por favor selecciona un evento del menú superior para visualizar
							las evaluaciones y estadísticas correspondientes.
						</p>
					</div>
				</div>
			:	<div className="space-y-6">
					{/* Filters Section */}
					<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
						<CardHeader>
							<CardTitle className="text-orange-500">
								Filtros de Búsqueda
							</CardTitle>
							<CardDescription>
								Use los campos para refinar los resultados
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start">
								<FiltroDesplegable
									label="Jefe de Familia"
									filterKey="jefeFamilia"
									value={filters.jefeFamilia}
									options={uniqueValues.jefesFamilia}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroDeTexto
									label="Cédula Jefe"
									filterKey="cedulaJefe"
									value={filters.cedulaJefe}
									onFilterChange={handleFilterChange}
									placeholder="Buscar por cédula..."
									className="w-full"
								/>
								<FiltroDesplegable
									label="Municipio"
									filterKey="municipio"
									value={filters.municipio}
									options={uniqueValues.municipios}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Parroquia"
									filterKey="parroquia"
									value={filters.parroquia}
									options={uniqueValues.parroquias}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Sector"
									filterKey="barrioSector"
									value={filters.barrioSector}
									options={uniqueValues.sectores}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Tipo de Evento"
									filterKey="tipoEvento"
									value={filters.tipoEvento}
									options={uniqueValues.tiposEvento}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Condición Vivienda"
									filterKey="condicionVivienda"
									value={filters.condicionVivienda}
									options={uniqueValues.condicionesVivienda}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Evaluador"
									filterKey="nombreEvaluador"
									value={filters.nombreEvaluador}
									options={uniqueValues.evaluadores}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroRangoNumerico
									label="Edad"
									filterKeyMin="edadMin"
									valueMin={filters.edadMin}
									filterKeyMax="edadMax"
									valueMax={filters.edadMax}
									onFilterChange={handleFilterChange}
									className="w-full"
								/>
								<FiltroRangoFecha
									label="Fecha de Evaluación"
									filterKeyInicio="fechaInicio"
									valueInicio={filters.fechaInicio}
									filterKeyFin="fechaFin"
									valueFin={filters.fechaFin}
									onFilterChange={handleFilterChange}
									className="w-full"
								/>
								<FiltroDesplegable
									label="Sexo"
									filterKey="sexo"
									value={filters.sexo}
									options={uniqueValues.sexos}
									onFilterChange={handleFilterChange}
									placeholder="Todos"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Patología"
									filterKey="patologia"
									value={filters.patologia}
									options={uniqueValues.patologias}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Talla Camisa"
									filterKey="tallaC"
									value={filters.tallaC}
									options={uniqueValues.tallasC}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Talla Pantalón"
									filterKey="tallaP"
									value={filters.tallaP}
									options={uniqueValues.tallasP}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
								<FiltroDesplegable
									label="Talla Zapatos"
									filterKey="tallaZ"
									value={filters.tallaZ}
									options={uniqueValues.tallasZ}
									onFilterChange={handleFilterChange}
									placeholder="Todas"
									className="w-full"
								/>
							</div>
							<div className="flex justify-end mt-4">
								<Button
									variant="ghost"
									onClick={resetFilters}
									className="text-orange-500 hover:text-orange-400"
								>
									Limpiar Filtros
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* KPIs Section */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10">
						<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Total Evaluaciones
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{kpiData.totalEvaluaciones}
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Total Personas Afectadas
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{kpiData.totalPersonas}
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Municipios Afectados
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{kpiData.totalMunicipios}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content: Tabs for Table and Charts */}
					<Tabs defaultValue="tabla" className="w-full px-10">
						<TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-zinc-800">
							<TabsTrigger
								value="tabla"
								className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
							>
								Tabla
							</TabsTrigger>
							{/* Este es el trigger que solo abre el modal */}
							<button
								role="tab"
								aria-selected="false"
								data-state="inactive"
								className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
								onClick={() => setIsMapModalOpen(true)}
							>
								Mapa
							</button>
							<TabsTrigger
								value="ubicacion"
								className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
							>
								Ubicación
							</TabsTrigger>
							<TabsTrigger
								value="demografia"
								className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
							>
								Demografía
							</TabsTrigger>
							<TabsTrigger
								value="afectaciones"
								className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
							>
								Afectaciones
							</TabsTrigger>
							<TabsTrigger
								value="salud"
								className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
							>
								Salud
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tabla">
							<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
								<CardHeader>
									<CardTitle className="text-orange-500">
										Resultados de la Búsqueda
									</CardTitle>
									<CardDescription>
										Total: {kpiData.totalEvaluaciones} evaluaciones encontradas.
									</CardDescription>
								</CardHeader>
								<CardContent className="w-full overflow-x-auto">
									<DataTable columns={tableColumns} data={filteredData} />
									<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
										<Button
											className="bg-red-600 font-bold hover:bg-red-700"
											variant="destructive"
											disabled={isGeneratingPdf}
											onClick={handleGeneratePdf}
										>
											{isGeneratingPdf ?
												"Generando Resumen..."
											:	"Generar Resumen"}
										</Button>
										<Button
											className="bg-green-600 font-bold hover:bg-green-700"
											variant="destructive" // Usamos destructive para el estilo base, pero sobreescribimos el color
											disabled={isGeneratingExcel}
											onClick={handleGenerateExcel}
										>
											{isGeneratingExcel ?
												"Generando Excel..."
											:	"Generar Excel"}
										</Button>
										<Button
											className="bg-blue-600 font-bold hover:bg-blue-700"
											variant="destructive"
											disabled={isGeneratingFicha}
											onClick={handleGenerateFicha}
										>
											{isGeneratingFicha ?
												"Generando Ficha..."
											:	"Generar Ficha"}
										</Button>
										<Button
											className="bg-purple-600 font-bold hover:bg-purple-700"
											variant="destructive"
											disabled={isGeneratingPlanilla}
											onClick={handleGeneratePlanilla}
										>
											{isGeneratingPlanilla ?
												"Generando Planilla..."
											:	"Generar Planilla"}
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="ubicacion">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Evaluaciones por Municipio
										</CardTitle>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={municipioData}>
												<CartesianGrid strokeDasharray="3 3" stroke="#444" />
												<XAxis dataKey="name" stroke="#888" fontSize={12} />
												<YAxis stroke="#888" fontSize={12} />
												<Tooltip
													contentStyle={{
														backgroundColor: "#333",
														border: "none",
													}}
												/>
												<Bar
													dataKey="value"
													fill="#0088FE"
													name="Evaluaciones"
												/>
											</BarChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
								<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Evaluaciones por Tipo de Evento
										</CardTitle>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={eventoData}
													dataKey="value"
													nameKey="name"
													cx="50%"
													cy="50%"
													outerRadius={100}
													label={({ name, percent }) =>
														`${name}: ${(percent * 100).toFixed(0)}%`
													}
												>
													{eventoData.map((_entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip
													contentStyle={{
														backgroundColor: "#333",
														border: "none",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="demografia">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card className="bg-gradient-to-br from-orange-500/10 to-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Distribución por Género
										</CardTitle>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={genderData}
													dataKey="value"
													nameKey="name"
													cx="50%"
													cy="50%"
													outerRadius={100}
													label={({ name, value }) => `${name}: ${value}`}
												>
													{genderData.map((_entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip
													contentStyle={{
														backgroundColor: "#333",
														border: "none",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
								<Card className="bg-zinc-900/50 border-zinc-700">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Distribución por Edad
										</CardTitle>
									</CardHeader>
									<CardContent className="h-80">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={ageData}>
												<CartesianGrid strokeDasharray="3 3" stroke="#444" />
												<XAxis dataKey="name" stroke="#888" fontSize={12} />
												<YAxis stroke="#888" fontSize={12} />
												<Tooltip
													contentStyle={{
														backgroundColor: "#333",
														border: "none",
													}}
												/>
												<Bar dataKey="value" fill="#82ca9d" name="Personas" />
											</BarChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="afectaciones">
							<Card className="bg-zinc-900/50 border-zinc-700">
								<CardHeader>
									<CardTitle className="text-blue-400">
										Top 10 Afectaciones
									</CardTitle>
								</CardHeader>
								<CardContent className="h-96">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={afectacionesData}
											layout="vertical"
											margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" stroke="#444" />
											<XAxis type="number" stroke="#888" />
											<YAxis
												type="category"
												dataKey="name"
												width={100}
												stroke="#888"
												fontSize={12}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "#333",
													border: "none",
												}}
											/>
											<Bar dataKey="value" fill="#FF8042" name="Casos" />
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="salud">
							<Card className="bg-zinc-900/50 border-zinc-700">
								<CardHeader>
									<CardTitle className="text-blue-400">
										Top 10 Patologías
									</CardTitle>
								</CardHeader>
								<CardContent className="h-96">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart
											data={patologiasData}
											margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
										>
											<CartesianGrid strokeDasharray="3 3" stroke="#444" />
											<XAxis
												dataKey="name"
												stroke="#888"
												fontSize={12}
												angle={-45}
												textAnchor="end"
												interval={0}
											/>
											<YAxis stroke="#888" fontSize={12} />
											<Tooltip
												contentStyle={{
													backgroundColor: "#333",
													border: "none",
												}}
											/>
											<Bar dataKey="value" fill="#00C49F" name="Casos" />
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			}
		</div>
	);
}
