import { Stack, router, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
	const { user, loading, token } = useAuth();
	const segments = useSegments();

	useEffect(() => {
		if (loading) return;

		const inAuthGroup = segments[0] === "login";

		if (!token && !inAuthGroup) {
			// Redirect to login if not authenticated
			router.replace("/login");
		} else if (token && inAuthGroup) {
			// Redirect to home if authenticated and trying to access login
			router.replace("/");
		}
	}, [token, loading, segments]);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#0f172a",
				}}
			>
				<ActivityIndicator size="large" color="#f97316" />
			</View>
		);
	}

	return (
		<>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					headerStyle: { backgroundColor: "#1e293b" },
					headerTintColor: "#fff",
					headerTitleStyle: { fontWeight: "bold" },
					contentStyle: { backgroundColor: "#0f172a" },
				}}
			>
				<Stack.Screen
					name="index"
					options={{ title: "Alertas", headerShown: true }}
				/>
				<Stack.Screen
					name="login"
					options={{ title: "Iniciar Sesión", headerShown: false }}
				/>
			</Stack>
		</>
	);
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootLayoutNav />
		</AuthProvider>
	);
}
