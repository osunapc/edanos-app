import { GrupoFamiliar } from "../type/type";
import { Card, CardContent, CardHeader, CardTitle } from "./uiredix/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./uiredix/table";

interface GrupoFamiliarModalProps {
	isOpen: boolean;
	onClose: () => void;
	grupo: GrupoFamiliar[];
    jefe: string | undefined;
}

export function GrupoFamiliarModal({ isOpen, onClose, grupo, jefe }: GrupoFamiliarModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
			onClick={onClose}
		>
			<div
				className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl"
				onClick={(e) => e.stopPropagation()}
			>
                <Card className="border-orange-500">
                    <CardHeader>
                        <CardTitle className="text-orange-500">Grupo Familiar de: <span className="text-white">{jefe}</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Apellidos y Nombres</TableHead>
                                    <TableHead>Cédula</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead>Sexo</TableHead>
                                    <TableHead>Parentesco</TableHead>
                                    <TableHead>Patologías</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grupo.length > 0 ? (
                                    grupo.map((miembro) => (
                                        <TableRow key={miembro.id}>
                                            <TableCell>{miembro.apellidosNombres}</TableCell>
                                            <TableCell>{miembro.cedula}</TableCell>
                                            <TableCell>{miembro.edad}</TableCell>
                                            <TableCell>{miembro.sexo}</TableCell>
                                            <TableCell>{miembro.parentesco}</TableCell>
                                            <TableCell>{miembro.patologias}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No hay miembros en el grupo familiar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
			</div>
		</div>
	);
}
