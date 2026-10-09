import { useEffect } from 'react';

// Context
import { ScreenState } from '../..';

const Component = () => {
	const { data } = ScreenState();

	useEffect(() => {
		document.documentElement.style.setProperty('--vespify-playlist-thumbnail', `url("${data.information.thumbnail}")`);

		return () => {
			document.documentElement.style.setProperty('--vespify-playlist-thumbnail', '');
		};
	}, []);

	return (
		<div className="media">
			<div style={{ backgroundImage: `url("${data.information.thumbnail}")` }} className="thumbnail"></div>

			<div className="title">{data.information.title}</div>
		</div>
	);
};

export default Component;
