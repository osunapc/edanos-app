import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface CodigoEventoProps {
	codigo: string;
	size?: "sm" | "md" | "lg";
}

export const CodigoEvento = ({ codigo, size = "md" }: CodigoEventoProps) => {
	const [visible, setVisible] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(codigo);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback
			const textArea = document.createElement("textarea");
			textArea.value = codigo;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const sizeClasses = {
		sm: "text-sm px-2 py-1",
		md: "text-base px-3 py-1.5",
		lg: "text-lg px-4 py-2",
	};

	return (
		<div className={`inline-flex items-center gap-2 bg-zinc-800 rounded-lg border border-zinc-700 ${sizeClasses[size]}`}>
			<code className="font-mono font-bold text-orange-400 tracking-wider">
				{visible ? codigo : "***-***"}
			</code>
			<div className="flex items-center gap-1">
				<button
					type="button"
					onClick={() => setVisible(!visible)}
					className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
					title={visible ? "Ocultar código" : "Mostrar código"}
				>
					{visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
				</button>
				<button
					type="button"
					onClick={handleCopy}
					className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
					title="Copiar código"
				>
					{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
				</button>
			</div>
		</div>
	);
};
