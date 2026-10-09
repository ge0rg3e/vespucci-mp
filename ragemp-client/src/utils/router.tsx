import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppContext } from './context';
import { fakeAwait } from './helpers';
// Systems
import Authentication from '@/views/systems/authentication';
import CharactersCreate from '@/views/systems/charactersCreate';
import Game from '@/views/systems/game';
import Profile from '@/views/systems/profile';
import KickScreen from '@/views/systems/kickScreen';
import PlayerList from '@/views/systems/playerList';
import Inventory from '@/views/systems/inventory';
import Dealership from '@/views/systems/dealership';
import GasPumps from '@/views/systems/gasPumps';
import Spectate from '@/views/systems/spectate';
import CarRadio from '@/views/systems/carRadio';
import Welcome from '@/views/systems/welcome';
import Pause from '@/views/systems/pause';
import Conversation from '@/views/systems/conversation';

// Businesses
import ClothesBuy from '@/views/systems/businesses/clothesBuy';
import ClothesManage from '@/views/systems/businesses/clothesManage';
import Tunning from '@/views/systems/businesses/tunning';
import Shop from '@/views/systems/businesses/shop';

// HUD
import Toasts from '@/views/game/features/toasts';
import Alerts from '@/views/game/features/alerts';
import GameComponents from '@/views/game/index';

const RoutingComponent = () => {
	const { account } = AppContext();

	return (
		<React.Fragment>
			<Router>
				<RouterEvents>
					<Routes>
						<Route path="/" element={<Game />} />
						<Route path="/welcome" element={<Welcome />} />
						<Route path="/authenticate" element={<Authentication />} />
						<Route path="/characters/create" element={<CharactersCreate />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/kick-screen" element={<KickScreen />} />
						<Route path="/player-list" element={<PlayerList />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route path="/dealership" element={<Dealership />} />
						<Route path="/gasPumps" element={<GasPumps />} />
						<Route path="/spectate" element={<Spectate />} />
						<Route path="/carRadio" element={<CarRadio />} />
						<Route path="/pause" element={<Pause />} />
						<Route path="/conversation" element={<Conversation />} />

						{/* Businesses Interfaces */}
						<Route path="/businesses/clothes/buy" element={<ClothesBuy />} />
						<Route path="/businesses/clothes/manage" element={<ClothesManage />} />
						<Route path="/businesses/tunning" element={<Tunning />} />
						<Route path="/businesses/shop" element={<Shop />} />
					</Routes>
				</RouterEvents>
				{/* This must be here to not lose state. */}
				<Alerts />
			</Router>

			{/* When we're in-game. */}
			{account !== null && <GameComponents />}

			{/* Toasts.. */}
			<Toasts />
		</React.Fragment>
	);
};

const RouterEvents = (props: ExpectedAny) => {
	const navigate = useNavigate();

	const onBrowserSetPage = (args: ExpectedAny) => {
		const { page } = JSON.parse(args);
		navigate(page);
	};

	const onBrowserSetPageAsync = async (args: ExpectedAny) => {
		const { page } = JSON.parse(args);
		navigate(page);
		await fakeAwait(150); // @Bugfix: We need to give the page 150 ms to make sure it loads + our events are loaded.
	};

	useEffect(() => {
		window.rpc.on('setPage', onBrowserSetPage);
		window.rpc.register('setPageAsync', onBrowserSetPageAsync);
		return () => {
			window.rpc.off('setPage', onBrowserSetPage);
			window.rpc.unregister('setPageAsync');
		};
	}, []);
	return props.children;
};
export default RoutingComponent;
