"use client";

import type { ColumnDef, Column } from "@tanstack/react-table";
import { Button } from "./uiredix/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./uiredix/dropdown-menu";
import { Evaluation, GrupoFamiliar } from "../type/type";

// Helper function to create a sortable header
const createSortableHeader = (
	column: Column<Evaluation, unknown>,
	title: string
) => (
	<Button
		variant="ghost"
		onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
	>
		{title}
		<ArrowUpDown className="ml-2 h-4 w-4" />
	</Button>
);

// Helper function for cell styling
const cellStyle = "text-[10px] sm:text-xs";

export const getColumns = (
	openModal: (grupo: GrupoFamiliar[], jefe: string | undefined) => void,
	openDetailModal: (evaluation: Evaluation) => void
): ColumnDef<Evaluation>[] => [
	{
		accessorKey: "id",
		header: ({ column }) => createSortableHeader(column, "ID"),
		cell: ({ row }) => <div className={cellStyle}>{row.getValue("id")}</div>,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => createSortableHeader(column, "Fecha"),
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return <div className={cellStyle}>{date.toLocaleDateString()}</div>;
		},
	},
	{
		accessorKey: "municipio",
		header: ({ column }) => createSortableHeader(column, "Municipio"),
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("municipio")}</div>
		),
	},
	{
		accessorKey: "parroquia",
		header: "Parroquia",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("parroquia")}</div>
		),
	},
	{
		accessorKey: "barrioSector",
		header: "Sector",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("barrioSector")}</div>
		),
	},
	{
		accessorKey: "tipoEvento",
		header: "Tipo de Evento",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("tipoEvento")}</div>
		),
	},
	{
		accessorKey: "jefeFamilia",
		header: "Jefe de Familia",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("jefeFamilia")}</div>
		),
	},
	{
		accessorKey: "cedulaJefe",
		header: "Cédula",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("cedulaJefe")}</div>
		),
	},
	{
		accessorKey: "telefonoJefeFamilia",
		header: "Teléfono",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("telefonoJefeFamilia")}</div>
		),
	},
	{
		accessorKey: "condicionVivienda",
		header: "Condición Vivienda",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("condicionVivienda")}</div>
		),
	},
	{
		accessorKey: "grupoFamiliar",
		header: "Miembros",
		cell: ({ row }) => {
			const grupoFamiliar = row.getValue("grupoFamiliar") as GrupoFamiliar[];
			return (
				<div className={`text-center ${cellStyle}`}>
					{grupoFamiliar.length + 1}
				</div>
			); // +1 for the jefe
		},
	},
	{
		accessorKey: "nombreEvaluador",
		header: "Evaluador",
		cell: ({ row }) => (
			<div className={cellStyle}>{row.getValue("nombreEvaluador")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const evaluation = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menú</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="bg-orange-500">
						<DropdownMenuItem
							className="text-white font-bold"
							onClick={() =>
								openModal(evaluation.grupoFamiliar, evaluation.jefeFamilia)
							}
						>
							Ver Grupo Familiar
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-white font-bold"
							onClick={() => openDetailModal(evaluation)}
						>
							Ver Detalles
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
