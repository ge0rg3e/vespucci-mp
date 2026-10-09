// Types
import { Album } from '@/services/vespify/music/types/definitions';
import { AppState } from '@/views/phone/applications/vespifyMusic';
import { truncateString } from '@/utils/helpers';

const Component = (props: Props) => {
	const { pushScreen } = AppState();

	const goToAlbum = () => {
		pushScreen('album', { id: props.data.id });
	};

	return (
		<div className="component-album minimal" onClick={goToAlbum}>
			<div className="content">
				<div
					className="thumbnail"
					style={{
						backgroundImage: `url("${props.data.thumbnail}")`
					}}
				></div>
				<div className="details">
					<div className="title">{truncateString(props.data.title, 20, true)}</div>
					<div className="artist">{props.data.artist || 'Community'}</div>
				</div>
			</div>
		</div>
	);
};

type Props = {
	data: Album;
};
export default Component;
