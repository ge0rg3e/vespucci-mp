import { createContext, useContext, useEffect, useState } from 'react';
import { AppContext } from '@/utils/context';

// Components
import Header from './components/header';
import Tabs from './components/tabs';
import List from './components/list';

// Demo data
import SimulatedResponse from './response';

// Types
export interface Player {
	id: number;
	username: string;
	developer: boolean;
	nearby: boolean;
	groups: string;
	admin: number;
	helper: number;
	agent: number;
}

interface Data {
	localInfo: Player;
	list: Array<Player>;
}

interface Context {
	getPlayers: (tabMode: string, searchString?: string) => Array<Player>;
	setSearch: (val: string) => void;
	setTab: (val: string) => void;
	setData: (val: Data) => void;

	lang: {
		get: (messageId: string, args?: object | undefined) => string;
	};
	data: Data | null;
	search: string;
	tab: string;
}

// Context
const Context = createContext({});
export const ComponentState = () => useContext(Context) as Context;

// Language
import * as i18n from '@vmp/i18n';
import Language from './index.language';
const languagePackId = `SYSTEM_PLAYERLIST`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const [data, setData] = useState<Data | null>(null);
	const [search, setSearch] = useState('');
	const [tab, setTab] = useState('all');
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const { isDarkEnvironment } = AppContext();

	const getPlayers = (tabMode: string, searchString?: string) => {
		let source: Array<Player> = [];
		switch (tabMode) {
			case 'all':
				source = data ? [data.localInfo, ...data.list] : [];
				break;
			case 'nearby':
				source = data!.list.filter((entry: Player) => entry.nearby === true);
				break;
			case 'staff':
				// prettier-ignore
				source = data
				? [data.localInfo, ...data.list].filter(
					(entry: Player) =>
					entry.admin !== 0 || entry.developer || entry.helper || entry.agent
					)
				: [];
				break;
			default:
				source = [];
				break;
		}

		let final = source.sort(function (a: Player, b: Player) {
			return a.id - b.id;
		});

		if (searchString && searchString.length > 0) {
			final = final.filter(
				(player: Player) =>
					player.username.toLowerCase().includes(search.toLowerCase()) ||
					player.id.toString() === search
			);
		}

		return final;
	};

	const passedVariables = {
		data,
		setData,
		search,
		setSearch,
		tab,
		setTab,
		lang,
		getPlayers
	};

	const onPlayerListDataReceived = (data: ExpectedAny) => setData(data);

	useEffect(() => {
		window.socket.on('onPlayerListDataReceived', onPlayerListDataReceived);

		if (window.mp.fake) {
			window.socket.simulateOn('onPlayerListDataReceived', SimulatedResponse);
		}
		return () => {
			window.socket.off('onPlayerListDataReceived');
		};
	}, []);

	if (data == null) return null;

	return (
		<Context.Provider value={passedVariables}>
			<div className="system-player-list">
				<img
					src={`/assets/images/systems/playerList/background.png`}
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
					className={`background`}
				/>

				<div className="content">
					<Header />
					<Tabs />
					<List players={getPlayers(tab, search)} />
				</div>
				<div className="hud-controls-overlay">
					<div className={`hud-controls ${isDarkEnvironment && `night-mode`}`}>
						<div className="entry">
							<div className="label">{lang.get('KeyHintESC')}</div>
							<div className="key">Esc</div>
						</div>
						<div className="entry">
							<div className="label">{lang.get('KeyHintSelect')}</div>
							<div className="key">{lang.get('KeySelectKey')}</div>
						</div>
					</div>
				</div>
			</div>
		</Context.Provider>
	);
};
export default Component;
