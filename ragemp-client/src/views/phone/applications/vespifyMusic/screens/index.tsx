import Home from './home';
import Search from './search';
import Player from './player';
import Album from './album';
import Artist from './artist';
import PlayList from './playlist';

const MappedScreens: ExpectedAny = {
	home: Home,
	search: Search,
	player: Player,
	album: Album,
	artist: Artist,
	playlist: PlayList
};

export default MappedScreens;
