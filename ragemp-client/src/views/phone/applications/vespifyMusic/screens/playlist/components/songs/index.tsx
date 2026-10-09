// Context
import { ScreenState } from '../..';

// Components
import Entry from './components/entry';

const Component = () => {
	const { data } = ScreenState();

	return (
		<div className="songs">
			{/* Iterating the songs */}
			{data.songs.map((song: ExpectedAny, ix: number) => (
				<Entry
					key={ix}
					title={song.title}
					artists={song.artists.map((c: ExpectedAny) => c.name).join(', ')}
					thumbnail={song.thumbnail}
					duration={song.duration}
				/>
			))}

			{/* Details */}
			<div className="total">
				<span className="songsCount">{data.information.songsCount}</span>
				<div className="dot"></div>
				<span className="totalDuration">{data.information.totalDuration}</span>
			</div>
		</div>
	);
};

export default Component;
