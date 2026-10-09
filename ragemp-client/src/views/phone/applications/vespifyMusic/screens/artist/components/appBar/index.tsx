import { AppState } from '../../../..';

const Component = () => {
	const { goToPreviousScreen } = AppState();

	return (
		<div className="component-app-bar">
			<div className="go-back" onClick={() => goToPreviousScreen()}>
				<i className="icon fa-light fa-arrow-left"></i>
			</div>
		</div>
	);
};

export default Component;
