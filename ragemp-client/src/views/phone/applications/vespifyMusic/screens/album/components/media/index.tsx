import { useEffect } from 'react';
import { ScreenState } from '../..';

const Component = () => {
	const { data } = ScreenState();

	useEffect(() => {
		// Set the variable to reflect on background too.
		document.documentElement.style.setProperty(
			'--vespify-album-thumbnail',
			`url("${data.information.thumbnail}")`
		);

		return () => {
			// Remove it..
			document.documentElement.style.setProperty('--vespify-album-thumbnail', '');
		};
	}, []);

	return (
		<div className="media">
			<div
				style={{ backgroundImage: `url("${data.information.thumbnail}")` }}
				className="thumbnail"
			></div>

			<div className="title">{data.information.title}</div>
		</div>
	);
};

export default Component;
