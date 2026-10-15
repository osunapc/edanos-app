"use client";
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/uiredix/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/uiredix/tabs";
import { Button } from "../../components/uiredix/button";
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
import { DataTable } from "../../components/data-table";
import { getColumns } from "../../components/columns";
import { Loader2 } from "lucide-react";
import { Evaluation, GrupoFamiliar } from "../../type/type";
import { FiltroDesplegable } from "../../components/filtros/FiltroDesplegable";
import { FiltroDeTexto } from "../../components/filtros/FiltroDeTexto";
import { FiltroRangoFecha } from "../../components/filtros/FiltroRangoFecha";
import { FiltroRangoNumerico } from "../../components/filtros/FiltroRangoNumerico";

import { COLORS } from "../../conf/chartConstants";
import { useEdanFilters } from "../../hooks/useEdanFilters";
import { useUniqueEdanValues } from "../../hooks/useUniqueEdanValues";
import { useEdanChartData } from "../../hooks/useEdanChartData";
import { useProcesarExcel } from "../../hooks/educacion/useProcesarExcel";
import { Input } from "../../components/uiredix/input";
import { GrupoFamiliarModal } from "../../components/GrupoFamiliarModal";
import { DetalleEdanModal } from "../../components/DetalleEdanModal";
import { MapaEdan } from "../../components/MapaEdan";

import {
	generatePdfReport,
	generateExcelReport,
	generateFichaPdf,
	generatePlanillaPdf,
} from "../../utils/edanExportUtils.tsx";

export default function AnaliticasEducacion() {
	const { isAuthenticated, user } = useAuth();
	const {
		datos: excelData,
		cargando: isProcessing,
		error,
		procesarArchivo,
	} = useProcesarExcel();
	const [file, setFile] = useState<File | null>(null);
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
	const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
	const [isGeneratingFicha, setIsGeneratingFicha] = useState(false);
	const [isGeneratingPlanilla, setIsGeneratingPlanilla] = useState(false);

	// Hooks de filtrado y gráficos (adaptados de EDAN)
	const { filters, handleFilterChange, resetFilters, filteredData } =
		useEdanFilters(excelData);
	const { uniqueValues } = useUniqueEdanValues(excelData);
	const {
		kpiData,
		genderData,
		ageData,
		municipioData,
		eventoData,
		afectacionesData,
		patologiasData,
	} = useEdanChartData(filteredData, filters);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
		}
	};

	const handleProcessFile = async () => {
		if (file) {
			procesarArchivo(file);
		} else {
			alert("Por favor, seleccione un archivo de Excel.");
		}
	};

	const handleGeneratePdf = async () => {
		await generatePdfReport(filteredData, setIsGeneratingPdf);
	};

	const handleGenerateExcel = async () => {
		await generateExcelReport(filteredData, setIsGeneratingExcel);
	};

	const handleGenerateFicha = async () => {
		await generateFichaPdf(filteredData, setIsGeneratingFicha);
	};

	const handleGeneratePlanilla = async () => {
		await generatePlanillaPdf(filteredData, setIsGeneratingPlanilla);
	};

	// --- Lógica de Modales (copiada de GraficosEdan) ---
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedGrupo, setSelectedGrupo] = useState<{
		grupo: GrupoFamiliar[];
		jefe: string | undefined;
	}>({ grupo: [], jefe: "" });

	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedEvaluation, setSelectedEvaluation] =
		useState<Evaluation | null>(null);

	// Map Modal State
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
		[]
	);

	const openDetailModal = useCallback((evaluation: Evaluation) => {
		setSelectedEvaluation(evaluation);
		setIsDetailModalOpen(true);
	}, []);

	const tableColumns = useMemo(
		() => getColumns(openModal, openDetailModal),
		[openModal, openDetailModal]
	);

	if (!isAuthenticated || user?.rol === "user") {
		return (
			<h1 className="text-white font-bold text-center mt-32 text-4xl">
				No está autorizado para ver esta página.
			</h1>
		);
	}

	return (
		<div className="dark min-h-screen w-full bg-slate-950 text-white overflow-hidden p-4 md:p-8">
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
			<MapaEdan
				isOpen={isMapModalOpen}
				onClose={() => setIsMapModalOpen(false)}
				evaluations={filteredData}
			/>

			<h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">
				Dashboard de Analíticas de Educación
			</h1>

			{/* Carga de Archivo */}
			<Card className="mb-6 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
				<CardHeader>
					<CardTitle className="text-cyan-400">
						Cargar Datos desde Excel
					</CardTitle>
					<CardDescription>
						Seleccione un archivo de Excel (.xlsx, .xls) para cargar y analizar
						los datos.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col sm:flex-row items-center gap-4">
					<Input
						type="file"
						onChange={handleFileChange}
						accept=".xlsx, .xls"
						className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
					/>
					<Button
						onClick={handleProcessFile}
						disabled={!file || isProcessing}
						className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
					>
						{isProcessing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Procesando...
							</>
						) : (
							"Cargar y Analizar"
						)}
					</Button>
				</CardContent>
			</Card>

			{error ? (
				<div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded text-center">
					<p>Error: {error}</p>
				</div>
			) : !excelData.length ? (
				<div className="text-center py-12">
					<p className="text-slate-400">
						Aún no se han cargado datos. Por favor, suba un archivo de Excel.
					</p>
				</div>
			) : (
				<div className="space-y-6">
					{/* Filters Section */}
					<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
						<CardHeader>
							<CardTitle className="text-cyan-400">
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
															className="text-cyan-400 hover:text-cyan-300"
														>
															Limpiar Filtros
														</Button>
													</div>
												</CardContent>					</Card>

					{/* KPIs Section */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Total Registros
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{kpiData.totalEvaluaciones}
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Total Personas
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{kpiData.totalPersonas}
								</div>
							</CardContent>
						</Card>
						<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-blue-400">
									Municipios
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
					<Tabs defaultValue="tabla" className="w-full">
						<TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-zinc-800">
							<TabsTrigger
								value="tabla"
								className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
							>
								Tabla
							</TabsTrigger>
							<button
								role="tab"
								aria-selected="false"
								data-state="inactive"
								className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
								onClick={() => setIsMapModalOpen(true)}
							>
								Mapa
							</button>

							<TabsTrigger
								value="ubicacion"
								className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
							>
								Ubicación
							</TabsTrigger>
							<TabsTrigger
								value="demografia"
								className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
							>
								Demografía
							</TabsTrigger>
							<TabsTrigger
								value="afectaciones"
								className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
							>
								Afectaciones
							</TabsTrigger>
							<TabsTrigger
								value="salud"
								className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
							>
								Salud
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tabla">
							<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
								<CardHeader>
									<CardTitle className="text-cyan-400">
										Datos del Excel
									</CardTitle>
									<CardDescription>
										Total: {filteredData.length} registros encontrados.
									</CardDescription>
								</CardHeader>
								<CardContent className="w-full overflow-x-auto">
									<DataTable columns={tableColumns} data={filteredData} />
									<div className="flex justify-center items-center gap-4 mt-4">
										<Button
											className="bg-red-600 font-bold hover:bg-red-700"
											variant="destructive"
											disabled={isGeneratingPdf}
											onClick={handleGeneratePdf}
										>
											{isGeneratingPdf ? "Generando Resumen..." : "Generar Resumen"}
										</Button>
										<Button
											className="bg-green-600 font-bold hover:bg-green-700"
											variant="destructive" // Usamos destructive para el estilo base, pero sobreescribimos el color
											disabled={isGeneratingExcel}
											onClick={handleGenerateExcel}
										>
											{isGeneratingExcel ? "Generando Excel..." : "Generar Excel"}
										</Button>
										<Button
											className="bg-blue-600 font-bold hover:bg-blue-700"
											variant="destructive"
											disabled={isGeneratingFicha}
											onClick={handleGenerateFicha}
										>
											{isGeneratingFicha ? "Generando Ficha..." : "Generar Ficha"}
										</Button>
										<Button
											className="bg-purple-600 font-bold hover:bg-purple-700"
											variant="destructive"
											disabled={isGeneratingPlanilla}
											onClick={handleGeneratePlanilla}
										>
											{isGeneratingPlanilla
												? "Generando Planilla..."
												: "Generar Planilla"}
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="ubicacion">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Registros por Municipio
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
												<Bar dataKey="value" fill="#0088FE" name="Registros" />
											</BarChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
								<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
									<CardHeader>
										<CardTitle className="text-blue-400">
											Registros por Tipo de Evento
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
								<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
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
								<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
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
							<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
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
							<Card className="bg-gradient-to-br from-cyan-500/10 to-slate-900/50 border-2 border-cyan-500/30 rounded-2xl">
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
			)}
		</div>
	);
}
