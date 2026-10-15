export function calcularPuntosHorario(horaEntrega) {
	const hora = horaEntrega.getHours();

	if (hora >= 6 && hora < 9) return 2; // 6am-9am
	if (hora >= 9 && hora < 17) return 1; // 9am-5pm
	if (hora >= 17 && hora < 20) return 2; // 5pm-8pm
	return 3; // 8pm-6am (cubre resto del tiempo)
}

export function calcularPuntosDuracion(creacion, entrega) {
	const minutos = Math.floor((entrega - creacion) / 1000 / 60);

	if (minutos < 15) return 2;
	if (minutos >= 15 && minutos < 25) return 1;
	if (minutos >= 25 && minutos <= 60) return 0;
	return -2;
}
