//  Context
import { truncateString } from '@/utils/helpers';
import { ScreenState } from '../..';
import { AppState } from '../../../..';

const Component = () => {
	const { data } = ScreenState();
	const { goToPreviousScreen } = AppState();

	return (
		<div className="component-header">
			<div className="go-back" onClick={() => goToPreviousScreen()}>
				<i className="icon fa-light fa-arrow-left"></i>
			</div>

			<div className="content">
				<div className="name">{truncateString(data.information.title, 30, true)}</div>
			</div>

			{/* Backgrounds */}
			<div
				className="background"
				style={{ backgroundImage: `url("${data.information.thumbnail}")` }}
			></div>
			<div className="background-faded"></div>
		</div>
	);
};

export default Component;
