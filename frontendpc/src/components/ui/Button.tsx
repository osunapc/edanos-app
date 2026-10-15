import { ReactNode, MouseEventHandler } from 'react';

interface ButtonProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
	disabled?: boolean;
	variant?: string;
	size?: string;
}

export function Button({ onClick, children }: ButtonProps) {
	return (
		<button
			className="animate-[float-in_0.8s_ease-out_0.4s_backwards] px-10 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center gap-2 group text-lg hover:scale-105 shadow-lg"
			onClick={onClick}
		>
			{children}
		</button>
	);
}
