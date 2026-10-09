import { Instance } from '@/services/vespify/music/types/context';
import { VespifyMusicService } from '@/services/vespify/music';
import { conditionalClassNames } from '@/utils/helpers';
import { State } from '../..';

const Component = () => {
	const { data } = State();
	const { updateControls } = VespifyMusicService();

	const onClick = () => {
		let newState: Instance['controls']['repeat'] = 'off';

		if (data.controls.repeat === 'off') {
			newState = 'all';
		} else if (data.controls.repeat === 'all') {
			newState = 'song';
		} else {
			newState = 'off';
		}

		// They can't use shuffle and repeat.
		if (newState !== 'off' && data.controls.shuffle) return false;

		updateControls(data.identifier, { repeat: newState });
	};

	return (
		<div
			className={conditionalClassNames('entry repeat', [
				{ if: data.loading, class: 'disabled' },
				{ if: data.controls.repeat === 'off', class: 'inactive' }
			])}
			onClick={onClick}
		>
			<i className={`icon fa-solid fa-repeat${data.controls.repeat === 'song' ? '-1' : ''}`}></i>
		</div>
	);
};

export default Component;
