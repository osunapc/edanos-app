import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./uiredix/button";
import { Input } from "./uiredix/input";
import { Label } from "./uiredix/label";
import { Card, CardContent, CardHeader, CardTitle } from "./uiredix/card";
import { X } from "lucide-react";

import { Evento } from "../type/type";
import { CodigoEvento } from "./CodigoEvento";

interface CrearEventoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCrear: (data: Partial<Evento>) => Promise<Evento | null>;
}

export function CrearEventoModal({
	isOpen,
	onClose,
	onCrear,
}: CrearEventoModalProps) {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [eventoCreado, setEventoCreado] = useState<Evento | null>(null);

	const [formData, setFormData] = useState({
		nombre: "",
		descripcion: "",
		tipoEvento: "",
		estado: user?.ubicacion || "",
		municipios: [] as string[],
	});

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (!formData.nombre || !formData.tipoEvento || !formData.estado) {
				throw new Error("Por favor complete los campos obligatorios");
			}

			const creado = await onCrear(formData);
			setEventoCreado(creado as Evento);
			setFormData({
				nombre: "",
				descripcion: "",
				tipoEvento: "",
				estado: user?.ubicacion || "",
				municipios: [],
			});
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Error al crear evento";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setEventoCreado(null);
		setError(null);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
			onClick={handleClose}
		>
			<div
				className="bg-slate-900 rounded-lg shadow-xl w-full max-w-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<Card className="border-orange-500/30 bg-transparent">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-orange-500 text-xl">
							{eventoCreado ? "Evento Creado" : "Crear Nuevo Evento"}
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleClose}
							className="text-slate-400 hover:text-white"
						>
							<X className="w-5 h-5" />
						</Button>
					</CardHeader>
					<CardContent>
						{eventoCreado ? (
							<div className="space-y-4">
								<div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded text-sm">
									Evento "{eventoCreado.nombre}" creado exitosamente
								</div>
								<div className="space-y-2">
									<Label className="text-slate-300">
										Código del Evento (compartir con evaluadores):
									</Label>
									<CodigoEvento codigo={eventoCreado.codigo} size="lg" />
								</div>
								<div className="text-xs text-slate-500">
									Los evaluadores pueden usar este código para unirse al evento desde la app móvil.
								</div>
								<div className="pt-4 flex justify-end">
									<Button
										onClick={handleClose}
										className="bg-orange-500 hover:bg-orange-600 text-white"
									>
										Cerrar
									</Button>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="nombre" className="text-slate-300">
										Nombre del Evento *
									</Label>
									<Input
										id="nombre"
										placeholder="Ej: Inundación Mérida Enero 2025"
										value={formData.nombre}
										onChange={(e) =>
											setFormData({ ...formData, nombre: e.target.value })
										}
										className="bg-slate-800 border-slate-700 text-white"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="tipo" className="text-slate-300">
											Tipo de Evento *
										</Label>
										<select
											id="tipo"
											value={formData.tipoEvento}
											onChange={(e) =>
												setFormData({ ...formData, tipoEvento: e.target.value })
											}
											className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
										>
											<option value="">Seleccione...</option>
											<option value="Inundación">Inundación</option>
											<option value="Deslizamiento">Deslizamiento</option>
											<option value="Incendio">Incendio</option>
											<option value="Sismo">Sismo</option>
											<option value="Vendaval">Vendaval</option>
											<option value="Otro">Otro</option>
										</select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="estado" className="text-slate-300">
											Estado *
										</Label>
										<Input
											id="estado"
											value={formData.estado}
											onChange={(e) =>
												setFormData({ ...formData, estado: e.target.value })
											}
											className="bg-slate-800 border-slate-700 text-white"
											disabled
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="descripcion" className="text-slate-300">
										Descripción
									</Label>
									<textarea
										id="descripcion"
										rows={3}
										value={formData.descripcion}
										onChange={(e) =>
											setFormData({ ...formData, descripcion: e.target.value })
										}
										className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
										placeholder="Detalles adicionales del evento..."
									/>
								</div>

								<div className="pt-4 flex justify-end gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={handleClose}
										className="border-slate-600 text-slate-300 hover:bg-slate-800"
									>
										Cancelar
									</Button>
									<Button
										type="submit"
										disabled={loading}
										className="bg-orange-500 hover:bg-orange-600 text-white"
									>
										{loading ? "Creando..." : "Crear Evento"}
									</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
