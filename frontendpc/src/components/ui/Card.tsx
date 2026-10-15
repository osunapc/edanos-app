import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
	return (
		<div className={`bg-zinc-800 max-w-md w-full p-10 rounded-md ${className}`}>
			{children}
		</div>
	);
}
