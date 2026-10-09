import { AppState } from '../../../..';
import { ScreenState } from '../..';

const Component = () => {
	const { goToPreviousScreen } = AppState();
	const { data } = ScreenState();

	return (
		<div className="appBar">
			<div className="go-back" onClick={() => goToPreviousScreen()}>
				<i className="icon fa-light fa-arrow-left"></i>
			</div>

			<div className="details">
				<div className="artist">{data.information.artist.name}</div>
				<div className="information">
					Album <div className="dot"></div> {data.information.year}
				</div>
			</div>
		</div>
	);
};

export default Component;
