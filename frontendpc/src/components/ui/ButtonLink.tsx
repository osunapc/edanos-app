import { Link } from "react-router-dom";

export interface ButtonLinkProps {
	to: string;
	children: React.ReactNode;
	onClick?: () => void;
}

export const ButtonLink = ({ to, children, onClick }: ButtonLinkProps) => {
	const isExternal = to.startsWith("http");
	const className =
		"animate-[float-in_0.8s_ease-out_0.4s_backwards] px-10 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center gap-2 group text-lg hover:scale-105 shadow-lg cursor-pointer inline-flex justify-center";

	if (isExternal) {
		return (
			<a
				href={to}
				onClick={onClick}
				className={className}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children}
			</a>
		);
	}

	return (
		<Link to={to} onClick={onClick} className={className}>
			{children}
		</Link>
	);
};
