import React, { useContext, createContext, useEffect, useState, useRef } from 'react';

// Context
const Context: ExpectedAny = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Utils
import SimulatedResponse from './utils/response';
import Events from './utils/events';
import { groupClothes } from '../clothesManage';

// Variables
let timerLoading: UndefinedAny = null;

// Components
import ExitButton from './components/exitButton';
import Balance from './components/balance';
import Details from './components/details';
import Categories from './components/categories';
import Search from './components/search';
import List from './components/list';

const Component = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<ExpectedAny>({
		clothing: {},
		allClothes: [],
		clothes: {},
		balance: {
			cash: 0,
			beachCoins: 0
		},
		lastDefaultGameClothingIds: {}
	});

	const [category, setCategory] = useState('tops');
	const [itemId, setItemId] = useState(null);
	const [search, setSearch] = useState({
		text: '',
		filters: {
			vipOnly: false,
			withinBudget: false,
			addonOnly: false
		}
	});

	const ref = useRef({
		data
	});

	const onPlayerDataReceived = (d: ExpectedAny) => {
		setData({ ...data, ...d });

		// Setting defaults
		setItemId(null);
	};

	const onChunkClothesDataReceived = (arr: Array<Clothes>) => {
		setData((currentState: ExpectedAny) => {
			const newState = { ...currentState };

			newState.allClothes = [...newState.allClothes, ...arr];
			newState.clothes = groupClothes(newState.allClothes);

			if (timerLoading !== null) {
				// Clear timeout
				clearTimeout(timerLoading);

				// Reset timer id
				timerLoading = null;
			}

			timerLoading = setTimeout(() => {
				// Callback function
				setLoading(false);

				// Reset timer id
				timerLoading = null;
			}, 300);

			return newState;
		});
	};

	const onBalanceUpdated = (args: ExpectedAny) => {
		const d = JSON.parse(args);
		setData((currentState: ExpectedAny) => ({
			...currentState,
			balance: {
				...d
			}
		}));
	};

	const onClothingUpdated = (args: ExpectedAny) => {
		const d = JSON.parse(args);
		setData((currentState: ExpectedAny) => ({ ...currentState, clothing: d }));
	};

	useEffect(() => {
		ref.current = {
			data
		};
	}, [data]);

	useEffect(() => {
		// Sockets
		window.socket.on('buyClothes:receivePlayerData', onPlayerDataReceived);
		window.socket.on('buyClothes:receiveChunkClothesData', onChunkClothesDataReceived);

		// RPC
		window.rpc.on('buyClothes:receiveNewBalance', onBalanceUpdated);
		window.rpc.on('buyClothes:receiveNewClothing', onClothingUpdated);

		// When this page loads..
		if (!window.mp.fake) {
			window.rpc.triggerServer('buyClothes:requestData');
		}

		// If is development..
		if (window.mp.fake) {
			window.socket.simulateOn(
				'buyClothes:receivePlayerData',
				SimulatedResponse.PlayerResponse
			);
			window.socket.simulateOn(
				'buyClothes:receiveChunkClothesData',
				SimulatedResponse.ClothesResponse
			);
		}

		return () => {
			window.socket.off('buyClothes:receivePlayerData');
			window.socket.off('buyClothes:receiveChunkClothesData');
			// RPC
			window.rpc.off('buyClothes:receiveNewBalance', onBalanceUpdated);
			window.rpc.off('buyClothes:receiveNewClothing', onClothingUpdated);
		};
	}, []);

	const ContextPassed = {
		data,
		setData,
		// Categories
		category,
		setCategory,
		// Item ID
		itemId,
		setItemId,
		// Searching
		search,
		setSearch,
		// Others
		loading
	};

	if (loading === true) return null;

	return (
		<Context.Provider value={ContextPassed}>
			<div className="system-buy-clothing">
				<div className="menu">
					<div className="comp-content">
						<Categories />
						<Search />
						<List />
					</div>
					<ExitButton />
				</div>
				<Balance />
				{itemId !== null && <Details />}
			</div>
			<Events />
		</Context.Provider>
	);
};

export default Component;
