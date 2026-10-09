import React, { useEffect, useState } from 'react';

// Dependencies
import { VespifyMusicService } from '@/services/vespify/music';

// Components
import Entry from './components/entry';
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';

const Component = (props: ExpectedAny) => {
	const [isLoadingSong, setIsLoadingSong] = useState<ExpectedAny>(null);
	const [currentSongId, setCurrentSongId] = useState<ExpectedAny>(null);

	// Context
	const { getInstance } = VespifyMusicService();
	const { changeSong } = VespifyMusicControls();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	const onSongSelected = (id: string) => {
		// If we are already loading a song.
		if (data.loading) return false;

		// For visual
		setIsLoadingSong(id);

		// For queue..
		if (props.type === 'queue') {
			setCurrentSongId(id);
		}

		// Update here
		changeSong(data.identifier, id);
	};

	useEffect(() => {
		setIsLoadingSong(null);
		setCurrentSongId(data.currentSong.id);
	}, [data.currentSong.id]);

	const songs = props.type === 'queue' ? data.queue : data.recommendations;

	return (
		<div className="sub-component-entries">
			<div className="--container">
				{songs.map((entry: ExpectedAny, ix: number) => (
					<Entry
						data={entry}
						isLoading={isLoadingSong === entry.id}
						isCurrentSong={currentSongId === entry.id ? true : false}
						key={ix}
						onClick={() => onSongSelected(entry.id)}
					/>
				))}
			</div>
		</div>
	);
};

export default Component;
