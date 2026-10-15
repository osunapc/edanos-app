import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function AnimatedBackground() {
	const particles = useRef(
		Array.from({ length: 20 }, () => ({
			x: new Animated.Value(Math.random() * width),
			y: new Animated.Value(Math.random() * height),
			opacity: new Animated.Value(Math.random()),
		}))
	).current;

	const gridAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Animar partículas
		particles.forEach((particle, index) => {
			const animateParticle = () => {
				Animated.loop(
					Animated.parallel([
						Animated.sequence([
							Animated.timing(particle.y, {
								toValue: height + 50,
								duration: 8000 + Math.random() * 4000,
								useNativeDriver: true,
							}),
							Animated.timing(particle.y, {
								toValue: -50,
								duration: 0,
								useNativeDriver: true,
							}),
						]),
						Animated.sequence([
							Animated.timing(particle.opacity, {
								toValue: 0.8,
								duration: 2000,
								useNativeDriver: true,
							}),
							Animated.timing(particle.opacity, {
								toValue: 0.2,
								duration: 2000,
								useNativeDriver: true,
							}),
						]),
					])
				).start();
			};
			setTimeout(animateParticle, index * 200);
		});

		// Animar grid
		Animated.loop(
			Animated.timing(gridAnim, {
				toValue: 1,
				duration: 3000,
				useNativeDriver: true,
			})
		).start();
	}, []);

	const gridTranslateY = gridAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 50],
	});

	return (
		<View style={styles.container}>
			{/* Grid animado */}
			<Animated.View
				style={[
					styles.grid,
					{
						transform: [{ translateY: gridTranslateY }],
					},
				]}
			>
				{Array.from({ length: 15 }).map((_, i) => (
					<View key={`h-${i}`} style={[styles.gridLine, { top: i * 50 }]} />
				))}
				{Array.from({ length: 8 }).map((_, i) => (
					<View
						key={`v-${i}`}
						style={[styles.gridLineVertical, { left: i * (width / 8) }]}
					/>
				))}
			</Animated.View>

			{/* Partículas flotantes */}
			{particles.map((particle, index) => (
				<Animated.View
					key={index}
					style={[
						styles.particle,
						{
							transform: [
								{ translateX: particle.x },
								{ translateY: particle.y },
							],
							opacity: particle.opacity,
						},
					]}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "transparent",
	},
	grid: {
		...StyleSheet.absoluteFillObject,
	},
	gridLine: {
		position: "absolute",
		width: "100%",
		height: 1,
		backgroundColor: "rgba(249, 115, 22, 0.1)",
	},
	gridLineVertical: {
		position: "absolute",
		width: 1,
		height: "100%",
		backgroundColor: "rgba(249, 115, 22, 0.1)",
	},
	particle: {
		position: "absolute",
		width: 3,
		height: 3,
		borderRadius: 1.5,
		backgroundColor: "#f97316",
		shadowColor: "#f97316",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
	},
});
