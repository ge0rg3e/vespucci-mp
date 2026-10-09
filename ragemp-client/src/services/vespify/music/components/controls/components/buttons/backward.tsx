import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';
import { conditionalClassNames } from '@/utils/helpers';
import { State } from '../..';

const Component = () => {
	const { data, antiNavigationSpam, setAntiNavigationSpam } = State();
	const { changeSong, getSongByDirection } = VespifyMusicControls();

	const onClick = () => {
		// Anti spam.
		if (antiNavigationSpam) return false;

		// Get current song index
		const currentIndex = data.queue.findIndex((c: ExpectedAny) => c.id === data.currentSong.id);
		if (currentIndex == -1) return false;

		const newSong = getSongByDirection(data.identifier, 'backward');
		if (!newSong) return false;

		// Play song
		changeSong(data.identifier, newSong.id);

		// Anti spam
		setAntiNavigationSpam(true);
		setTimeout(() => setAntiNavigationSpam(false), 3000);
	};

	return (
		<div
			className={conditionalClassNames('entry backward', [{ if: data.loading, class: 'disabled inactive' }])}
			onClick={onClick}
		>
			<i className="icon fa-solid fa-backward"></i>
		</div>
	);
};

export default Component;
