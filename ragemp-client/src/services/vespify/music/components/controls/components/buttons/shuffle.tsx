import { VespifyMusicService } from '@/services/vespify/music';
import { conditionalClassNames } from '@/utils/helpers';
import { State } from '../..';

const Component = () => {
	const { data } = State();
	const { updateControls } = VespifyMusicService();

	const onClick = () => {
		// Get the new state
		const newState = data.controls.shuffle ? false : true;

		// They can't use shuffle and repeat.
		if (newState === true && data.controls.repeat !== 'off') return false;

		updateControls(data.identifier, { shuffle: newState });
	};

	return (
		<div
			className={conditionalClassNames('entry', [
				{ if: data.loading, class: 'disabled' },
				{ if: !data.controls.shuffle, class: 'inactive' }
			])}
			onClick={onClick}
		>
			<i className="icon fa-solid fa-shuffle"></i>
		</div>
	);
};

export default Component;
