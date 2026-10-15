import { UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Header() {
	const { isAuthenticated, user } = useAuth();

	return (
		<header className="bg-primary text-primary-foreground shadow-md">
			<div className="container mx-auto py-4 px-4 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<img
						src="/placeholder.svg?height=40&width=40"
						alt="Logo"
						className="h-10 w-10"
					/>
					<h1 className="text-xl font-bold">Instituto de Protección Civil</h1>
				</div>

				<div className="flex items-center space-x-2">
					{isAuthenticated && user ? (
						<div className="flex items-center space-x-2">
							<UserCircle className="h-6 w-6" />
							<span>{user.nombre}</span>
						</div>
					) : (
						<span>Invitado</span>
					)}
				</div>
			</div>
		</header>
	);
}
