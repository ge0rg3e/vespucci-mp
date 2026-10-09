import React from 'react';
import moment from 'moment';

// Components
import Chart from '@components/charts';

// Dependencies
import ComponentLanguages from './chart.language';
import { formatNumber, createComponentLanguage, getComponentLanguage } from '@/utils/helpers';

// Context
import { PageState } from '../../..';

// Create the language pack..
const TranslationPack = createComponentLanguage('homepage.chart', ComponentLanguages);

const Component = () => {
	const { chartData } = PageState();
	const lang = getComponentLanguage(TranslationPack);

	const data: ComponentChartData = {
		labels: chartData.map((g: ExpectedAny) => `${moment(g.date).format('HH:00')}`), // timming may be off by 1 minute or so
		datasets: [
			{
				label: lang.get('datasetLabel'),
				data: chartData.map((g: ExpectedAny) => `${formatNumber(g.value)}`),
				backgroundColor: 'rgba(241, 149, 172, 0.08)',
				borderColor: 'rgba(241, 149, 172, 0.5)',
				borderWidth: 3,
				fill: true
			}
		]
	};

	const options: ComponentChartOptions = {
		plugins: {
			legend: {
				display: false
			}
		}
	};

	return (
		<div className="graph">
			<Chart type="line" options={options} data={data} />
		</div>
	);
};

export default Component;
