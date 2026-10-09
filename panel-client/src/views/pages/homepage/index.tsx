import React, { createContext, useContext, useEffect } from 'react';

// Dependencies
import Container from '@/views/layout/core/container';

// Types
import { Props } from './types';

// Components
import Activity from './components/activity';
import Actions from './components/actions';
import Properties from './components/properties';
import News from './components/news';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { createAmplitudeEvent } from '@/utils/amplitude';

const TranslationPack = createComponentLanguage('homepage.main', ComponentLanguages);

// Context
const Context = createContext({});
export const PageState: ExpectedAny = () => useContext(Context);

const Component = (props: Props) => {
	const lang = getComponentLanguage(TranslationPack);

	const contextPassed = {
		metrics: props.metrics,
		chartData: props.chartData,
		actions: props.actions
	};

	useEffect(() => {
		createAmplitudeEvent(`Homepage`);
	}, []);

	return (
		<Container title={lang.get('seoTitle')} classNames="page-homepage" breadcrumbs={[{ shortcut: 'home' }]}>
			<Context.Provider value={contextPassed}>
				<div className="page-layout">
					<div className="page-side-left">
						<Activity />
						<Actions />
					</div>

					<div className="page-side-right">
						<Properties />
						<News />
					</div>
				</div>
			</Context.Provider>
		</Container>
	);
};

export default Component;
