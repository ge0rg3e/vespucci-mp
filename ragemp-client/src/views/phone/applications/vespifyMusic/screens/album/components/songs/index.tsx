import { ScreenState } from '../..';

// Components
import Entry from './component/entry';

const Component = () => {
	const { data } = ScreenState();

	return (
		<div className="songs">
			{/* Iterating songs */}
			{data.songs.map((song: ExpectedAny, ix: number) => (
				<Entry
					key={ix}
					songNumber={ix + 1}
					title={song.title}
					artistName={data.information.artist.name}
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
