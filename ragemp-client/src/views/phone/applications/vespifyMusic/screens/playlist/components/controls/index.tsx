// Context
import { ScreenState } from '../..';
import { AppState } from '../../../..';

const Component = () => {
	const { data } = ScreenState();
	const { pushScreen } = AppState();

	const startPlaylist = () => {
		pushScreen('player', { type: 'playlist', id: data.information.id });
	};

	const onAddToLibrary = () => window.toast({ type: 'error', message: 'Feature not developed yet.' });

	const onHeart = () => {
		window.toast({ type: 'error', message: 'Feature not developed yet.' });
	};

	return (
		<div className="controls">
			<div className="entry --addToLibrary" onClick={onAddToLibrary}>
				<i className="icon fa-regular fa-bookmark" />
			</div>

			<div className="entry --play" onClick={startPlaylist}>
				<i className="icon fa-solid fa-play" />
			</div>

			<div className="entry --share" onClick={onHeart}>
				<i className="icon fa-solid fa-heart" />
			</div>
		</div>
	);
};

export default Component;
