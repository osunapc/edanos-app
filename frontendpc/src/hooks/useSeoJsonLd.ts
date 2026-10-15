import { useEffect } from "react";

interface JsonLdProps {
	script: object;
}

export function useSeoJsonLd({ script }: JsonLdProps) {
	useEffect(() => {
		const scriptId = "seo-json-ld";
		let element = document.getElementById(scriptId) as HTMLScriptElement | null;

		if (!element) {
			element = document.createElement("script") as HTMLScriptElement;
			element.id = scriptId;
			element.type = "application/ld+json";
			document.head.appendChild(element);
		}

		element.textContent = JSON.stringify(script);

		return () => {
			if (element) {
				element.textContent = "";
			}
		};
	}, [script]);
}

export const proyectoSchema = (
	projectName: string,
	description: string,
	url: string,
) => ({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: projectName,
	description: description,
	url: url,
	applicationCategory: "UtilitiesApplication",
	operatingSystem: ["Web", "Android", "iOS"],
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	creator: {
		"@type": "Person",
		name: "Gabriel Leonardo Espitia Osuna",
		jobTitle:
			"Desarrollador de Software, Exfuncionario de Protección Civil Mérida",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Mérida",
			addressCountry: "VE",
		},
	},
	author: {
		"@type": "Organization",
		name: "EDANOS - grupo de investigacion tecnologica para la gestion de riesgo",
		url: "https://edanosapp.site",
	},
});
