import { ChartData, ChartOptions, ChartType } from 'chart.js';

export type ChartProps = {
	type: ChartType;
	options: ChartOptions;
	data: ChartData;
};

declare global {
	type ComponentChartData = ChartData;
	type ComponentChartOptions = ChartOptions;
}

export {};
