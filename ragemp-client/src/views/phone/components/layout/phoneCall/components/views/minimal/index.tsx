import React from 'react';

// Components
import Avatar from './components/avatar';
import Information from './components/information';
import RightSide from './components/options';

// Context
import { ComponentState } from '../../../';
import { PhoneState } from '@/views/phone';

const Component = () => {
	const { uiState } = PhoneState();
	const { switchOverlayTheme } = ComponentState();

	const onClickOverlay = (ev: ExpectedAny) => {
		// Is clicking on the buttons.
		if (ev.target.closest('.right-side')) return false;

		switchOverlayTheme();
	};

	// We will not render the minimal state in this scenarios.
	if (uiState.loading || uiState.blurred === true || uiState.opening === true) return null;

	return (
		<React.Fragment>
			<div className="layout-container" onClick={onClickOverlay}>
				<div className="left-side">
					<Avatar />
					<Information />
				</div>
				<RightSide />
			</div>
		</React.Fragment>
	);
};

export default Component;
