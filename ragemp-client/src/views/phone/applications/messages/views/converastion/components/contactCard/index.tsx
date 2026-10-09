import React from 'react';

// Components
import Header from './components/header';
import Actions from './components/actions';
import Options from './components/options';
import { ViewState } from '../..';

const Component = () => {
	const { setShowContactCard } = ViewState();

	return (
		<React.Fragment>
			<div className={`popup-contact-card`}>
				<div className="--background" onClick={() => setShowContactCard(false)}></div>
				<div className="--content">
					<Header />
					<Actions />
					<Options />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
