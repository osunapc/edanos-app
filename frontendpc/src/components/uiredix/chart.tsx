"use client";

import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

import { cn } from "../../lib/utils";

interface ChartConfig {
	[key: string]: {
		label: string;
		color?: string;
	};
}

interface ChartContextProps {
	config: ChartConfig;
	className?: string;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function ChartRoot({
	config,
	children,
	className,
}: {
	config: ChartConfig;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<ChartContext.Provider value={{ config, className }}>
			<div className={cn("recharts-wrapper", className)}>
				<style>
					{Object.entries(config)
						.filter(([, value]) => value.color)
						.map(([key, value]) => {
							return `
                .recharts-wrapper .color-${key} {
                  fill: ${value.color};
                  stroke: ${value.color};
                }
                .recharts-wrapper .bg-${key} {
                  background: ${value.color};
                }
                :root {
                  --color-${key}: ${value.color};
                }
              `;
						})
						.join("")}
				</style>
				<ResponsiveContainer width="100%" height="100%">
					{children as React.ReactElement}
				</ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
}

const ChartTooltip = React.forwardRef<
	React.ElementRef<typeof Tooltip>,
	React.ComponentPropsWithoutRef<typeof Tooltip>
>((props, ref) => {
	return <Tooltip ref={ref} {...props} />;
});
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> &
		Pick<TooltipProps<number | string, string>, "payload" | "label"> & {
			hideLabel?: boolean;
		}
>(({ className, hideLabel = false, payload, label, ...props }, ref) => {
	const context = React.useContext(ChartContext);

	if (!context || !payload?.length) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn(
				"rounded-lg border bg-background px-3 py-1.5 shadow-md",
				className
			)}
			{...props}
		>
			<div className="flex flex-col gap-y-2">
				{!hideLabel && label ? (
					<div className="text-sm font-medium">{label}</div>
				) : null}
				<div className="flex flex-col gap-y-1">
					{payload.map((item, index: number) => {
						// Protege el acceso a dataKey
						const dataKey = item.dataKey as string | undefined;
						const config = dataKey ? context.config[dataKey] : undefined;
						const name = config?.label ?? item.name ?? dataKey ?? "";
						const color = config?.color ?? item.color;

						let valueContent: string | number = "";
						if (typeof item.value === "number") {
							valueContent = item.value.toLocaleString();
						} else if (typeof item.value === "string") {
							valueContent = item.value;
						}

						return (
							<div key={index} className="flex items-center gap-x-2">
								<div
									className="h-2 w-2 rounded-full"
									style={{ background: color }}
								/>
								<div className="flex items-center gap-x-2">
									<span className="text-xs text-muted-foreground">
										{String(name)}
									</span>
									<span className="text-xs font-medium">{valueContent}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
});
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend: React.FC<React.ComponentPropsWithoutRef<typeof Legend>> = ({
	className,
	...props
}) => {
	return (
		<Legend
			verticalAlign="top"
			height={60}
			{...props}
			className={cn("", className)}
		/>
	);
};
ChartLegend.displayName = "ChartLegend";

const ChartLegendContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div"> &
		Pick<TooltipProps<number | string, string>, "payload">
>(({ className, payload, ...props }, ref) => {
	const context = React.useContext(ChartContext);

	if (!context || !payload?.length) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn("flex items-center gap-4", className)}
			{...props}
		>
			{payload.map((item, index: number) => {
				const dataKey = item.dataKey as string | undefined;
				const config = dataKey ? context.config[dataKey] : undefined;
				const name = config?.label ?? item.value;
				const color = config?.color ?? item.color;

				return (
					<div key={index} className="flex items-center gap-x-2">
						<div
							className="h-2 w-2 rounded-full"
							style={{ background: color }}
						/>
						<span className="text-xs text-muted-foreground">
							{String(name)}
						</span>
					</div>
				);
			})}
		</div>
	);
});
ChartLegendContent.displayName = "ChartLegendContent";

export {
	ChartRoot as ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
};
