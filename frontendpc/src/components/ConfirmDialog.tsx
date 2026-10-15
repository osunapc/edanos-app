import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./uiredix/card";
import { Button } from "./uiredix/button";

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
}

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
}: ConfirmDialogProps) {
	if (!isOpen) return null;

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<Card className="w-full max-w-md bg-slate-900 border-2 border-orange-500/30">
				<CardHeader>
					<CardTitle className="text-orange-500 text-xl">{title}</CardTitle>
					<CardDescription className="text-slate-300 text-base">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-3 justify-end">
						<Button
							variant="outline"
							onClick={onClose}
							className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600"
						>
							{cancelText}
						</Button>
						<Button
							onClick={handleConfirm}
							className="bg-red-600 text-white hover:bg-red-700"
						>
							{confirmText}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
