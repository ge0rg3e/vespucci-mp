import { ChartOptions, ChartType } from 'chart.js';
import lodash from 'lodash';

export const getChartOptions = <T extends ChartType>(type: T, options: ChartOptions<T>) => {
	const fontFamily = 'Sohne';

	const boilerplate: ExpectedAny = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: {
					font: {
						size: 14,
						family: fontFamily
					}
				}
			},
			tooltip: {
				titleFont: {
					size: 15,
					family: fontFamily
				},
				bodyFont: {
					size: 13.5,
					family: fontFamily
				}
			}
		},
		scales: {
			x: {
				ticks: {
					font: {
						size: 14,
						family: fontFamily
					}
				},
				grid: {
					// display: false,
					color: 'rgba(241, 149, 172, 0.01)'
				}
			},

			y: {
				ticks: {
					font: {
						size: 14,
						family: fontFamily
					}
				},
				grid: {
					// display: false,
					color: 'rgba(241, 149, 172, 0.01)'
				}
			}
		}
	};

	const result: ChartOptions<T> = lodash.merge(boilerplate, options);
	return result;
};
