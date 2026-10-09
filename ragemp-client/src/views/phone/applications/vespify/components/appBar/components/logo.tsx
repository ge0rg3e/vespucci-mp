import React from 'react';

// Context
import { AppState } from '../../..';

const Component = (props: Props) => {
	const { screen, setScreen, search, setSearch } = AppState();

	const goHome = () => {
		if (props.disableRedirect === true) return false;

		// If current screen is home
		if (screen.id === 'search' && search.inputValue.length > 0) {
			setSearch((currentState: ExpectedAny) => ({
				...currentState,
				inputValue: '',
				results: []
			}));
		}

		setScreen({ id: 'home', payload: {} });
	};
	return (
		<React.Fragment>
			<div className={`logo`} onClick={goHome}>
				<div className="image"></div>
				{props.withText && <div className="text">Vespify</div>}
			</div>
		</React.Fragment>
	);
};

type Props = {
	withText: boolean;
	disableRedirect?: boolean;
};
export default Component;
