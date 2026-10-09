import React, { useContext, createContext, useEffect, useState, useRef } from 'react';

// Context
const Context: ExpectedAny = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Simulated response
import SimulatedResponse from './response';

// Components
import Categories from './components/leftSide/categories';
import List from './components/leftSide/list';
import Search from './components/leftSide/search';
import RightSide from './components/rightSide/wrapper';
import Textures from './components/leftSide/textures';
import ItemDetails from './components/middle/itemDetails';
import Options from './components/leftSide/options';
import CreateClothing from './components/middle/createClothing';

// Events
import Events from './components/events';
import { logError, sliceIntoChunks, updateStateObjectDeep } from '@/utils/helpers';

// Variables
let timerGrouping: UndefinedAny = null;
let timerLoading: UndefinedAny = null;

const Component = () => {
	const [data, setData] = useState<ExpectedAny>({
		clothing: {},
		clothes: [],
		originalClothes: {}, // used to know which have been changed or not.
		permissions: {}
	});
	const [loadedData, setLoadedData] = useState(false);
	const [category, setCategory] = useState('tops');
	const [itemId, setItemId] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [texturesFound, setTexturesFound] = useState([]);
	const [groupedClothes, setGroupedClothes] = useState<ExpectedAny>({});
	const [filters, setFilters] = useState({
		inStore: false,
		vipOnly: false,
		addonsOnly: false
	});

	const [settings, _setSettings] = useState({
		advancedEditing: false,
		swappingTorsos: false,
		showOptions: false,
		createClothing: false,
		saveChanges: true
	});

	const setSettings = (key: string, val: ExpectedAny) =>
		updateStateObjectDeep(_setSettings, key, val);

	const ref = useRef({
		data
	});

	const onBaseDataReceived = async (d: ExpectedAny) => {
		setData({
			...d,
			originalClothes: [...d.clothes]
		});
		const grouped = groupClothes(d.clothes);
		setGroupedClothes(grouped);
		setItemId(null);

		if (d.permissions.update === false) {
			setSettings('saveChanges', false);
		}

		timerLoading = setTimeout(() => {
			// Callback function
			setLoadedData(true);

			// Reset timer id
			timerLoading = null;
		}, 300);
	};

	const onChunkClothesDataReceived = async (arr: Array<Clothes>) => {
		setData((currentState: ExpectedAny) => {
			const newState = { ...currentState };
			newState.clothes = [...newState.clothes, ...arr];
			newState.originalClothes = [...newState.clothes, ...arr];

			if (timerGrouping !== null) {
				// Clear timeout
				clearTimeout(timerGrouping);

				// Reset timer id
				timerGrouping = null;
			}

			timerGrouping = setTimeout(() => {
				// Callback func tions
				const grouped = groupClothes(newState.clothes);
				setGroupedClothes(grouped);

				// Reset timer id
				timerGrouping = null;
			}, 200);

			if (timerLoading !== null) {
				// Clear timeout
				clearTimeout(timerLoading);

				// Reset timer id
				timerLoading = null;
			}

			timerLoading = setTimeout(() => {
				// Callback function
				setLoadedData(true);

				// Reset timer id
				timerLoading = false;
			}, 600);

			return newState;
		});
	};

	const changePedClothing = async (
		type: string,
		clothing: {
			drawableId: number;
			textureId: number;
			isAddon: boolean;
		},
		meta?: ExpectedAny,
		saveClothes = true
	) => {
		try {
			// Getting current clothing
			const playerClothing = data.clothing;

			// Converting the categories "undershirts" => "undershirt"
			const key = mapClothesPlurals[type] ? mapClothesPlurals[type] : type;

			// Clothes that will be applied but not saved.
			const tempClothing: ExpectedAny = {};

			// Applying the change clothing
			playerClothing[key] = {
				drawableId: clothing.drawableId,
				textureId: clothing.textureId,
				isAddon: clothing.isAddon
			};

			// If top is changing we need to apply the right torso and remove undershirt if it's not compatible.
			if (key === 'top') {
				const torsoRecommended = groupedClothes['torsos'].find(
					(c: Clothes) => c.id === meta.torsoRecommended
				);

				if (torsoRecommended) {
					playerClothing['torso'] = {
						drawableId: torsoRecommended.drawableId,
						textureId: torsoRecommended.textureId,
						isAddon: torsoRecommended.isAddon
					};
				}
			}

			// If his top is not compatible with having an undershirt.

			let undershirtCompatible = false;

			if (type !== 'top') {
				const topData = data.clothing.top;

				const top = groupedClothes['tops'].find(
					(c: Clothes) =>
						c.gender === data.clothing.gender &&
						c.drawableId === topData.drawableId &&
						c.textureId === topData.textureId &&
						c.isAddon === topData.isAddon
				);

				undershirtCompatible = top ? top.meta.undershirtCompatible : false;
			} else {
				undershirtCompatible = meta.undershirtCompatible;
			}

			if (undershirtCompatible === false) {
				tempClothing['undershirt'] = {
					drawableId: data.clothing.gender === 'male' ? 15 : 3,
					textureId: 0,
					isAddon: false
				};
			}

			window.rpc.triggerServer(
				'clothing:applyPedClothing',
				JSON.stringify({
					clothes: {
						...playerClothing,
						...tempClothing
					}
				})
			);

			if (saveClothes) {
				setData({
					...data,
					clothing: playerClothing
				});
			}
		} catch (err) {
			await logError('CHANGE_PED_CLOTHING', err, { manageClothing: true });
		}
	};

	const changeCameraFocus = () => {
		let newTarget = 'body';

		if (category === 'shoes') {
			newTarget = 'foot';
		} else if (['masks', 'earings', 'glasses', 'hats'].includes(category)) {
			newTarget = 'head';
		}

		window.rpc.triggerClient(
			'clothesBusiness:PointCamera',
			JSON.stringify({ target: newTarget })
		);
	};

	useEffect(() => {
		ref.current = {
			data
		};

		// Grouping the clothes to fasten up the process.
		setGroupedClothes(groupClothes(data.clothes));
	}, [data]);

	// When they will change category the itemid will be set to nul.
	useEffect(() => {
		if (itemId === null) {
			setTexturesFound([]);
		}
	}, [itemId]);

	useEffect(() => {
		const elm = document.getElementById('items-entries');
		elm?.scrollTo(0, 0);
		changeCameraFocus();

		//
		setItemId(null);
	}, [category]);

	// When they change the gender..
	useEffect(() => setItemId(null), [data.clothing.gender]);

	useEffect(() => {
		window.socket.on('manageClothes:receiveInitialData', onBaseDataReceived);
		window.socket.on('manageClothes:receiveChunkClothesData', onChunkClothesDataReceived);
		if (!window.mp.fake) {
			window.rpc.triggerServer('manageClothes:requestData');
		} else {
			window.socket.simulateOn('manageClothes:receiveInitialData', SimulatedResponse);
		}
		return () => {
			window.socket.off('manageClothes:receiveInitialData');
			window.socket.off('manageClothes:receiveChunkClothesData');
		};
	}, []);

	const leaveSystem = async (saveChanges = true) => {
		try {
			let updatedClothesNumber = 0;

			if (saveChanges && data.permissions.update === true) {
				// We need to know which ones were updated.
				const updatedClothes = data.clothes
					.filter(
						(c: Clothes, ix: number) =>
							JSON.stringify(data.clothes[ix]) !==
							JSON.stringify(data.originalClothes[ix])
					)
					.map((item: Clothes) => ({
						// Only these fields should be upgradable. Also we do this to make the data sent faster hehe.
						id: item.id,
						name: item.name,
						category: item.category,
						price: item.price || 0, // we need validation for this,
						bcPrice: item.bcPrice || 0, // we need validation for this
						minimumDonorTier: item.minimumDonorTier,
						isAvailable: item.isAvailable,
						isAddon: item.isAddon,
						dlcName: item.dlcName,
						meta: item.meta
					}));

				updatedClothesNumber = updatedClothes.length;
				// Just in case. Socket.io can transfer max 3k clothes but let's play it safe
				const chunks = sliceIntoChunks(updatedClothes, 2000);

				chunks.forEach((chunk) => {
					window.socket.emit('manageClothes:saveClothesBulk', {
						data: chunk
					});
				});
			}
			window.rpc.triggerServer(
				'manageClothes:leaveSystem',
				JSON.stringify({ clothesUpdated: updatedClothesNumber })
			);
		} catch (err) {
			await logError(`LEAVE_CLOTHES_MANAGEMENT`, err);
		}
	};

	const getListedTops = () =>
		groupedClothes['tops'].filter((c: Clothes) =>
			c.gender === data.clothing.gender ? data.clothing.gender : 'male'
		);

	const getCurrentTop = () => {
		if (!groupedClothes['tops']) return null; // not loaded yet.
		const torso = ref.current.data.clothing.top;

		const match = getListedTops().find(
			(c: Clothes) =>
				torso.drawableId === c.drawableId &&
				torso.textureId === c.textureId &&
				torso.isAddon === c.isAddon
		);

		if (!match) return null;

		return match;
	};

	const undershirtDisabled =
		getCurrentTop() &&
		getCurrentTop().meta &&
		getCurrentTop().meta.undershirtCompatible !== true
			? true
			: false;

	const ContextPassed = {
		data,
		groupedClothes,
		setData,
		category,
		setCategory,
		itemId,
		setItemId,
		gender: data.clothing.gender ? data.clothing.gender : 'male',
		changePedClothing,
		// Searching
		searchValue,
		setSearchValue,
		// Filters
		filters,
		setFilters,
		// Others
		leaveSystem,
		texturesFound,
		setTexturesFound,
		loadedData,
		// Helpers
		undershirtDisabled,
		// Settings
		settings,
		setSettings
	};

	if (
		Object.keys(data.clothes).length < 1 ||
		Object.keys(groupedClothes).length < 1 ||
		loadedData === false
	)
		return null;

	return (
		<Context.Provider value={ContextPassed}>
			<div className={`system-manage-clothing ${settings.createClothing && 'modalActive'}`}>
				<div className="left-side">
					<Categories />
					<div className={`items`}>
						{!settings.showOptions ? (
							<React.Fragment>
								<Search />
								<List />
							</React.Fragment>
						) : (
							<Options />
						)}
					</div>
					{!settings.showOptions && (
						<div className="side">
							<Textures />
						</div>
					)}
				</div>
				{itemId && <RightSide />}
				<ItemDetails />
				{settings.createClothing && <CreateClothing />}
			</div>
			<Events />
		</Context.Provider>
	);
};

export const groupClothes = (arr: ExpectedAny) => {
	const obj: ExpectedAny = {
		tops: [],
		torsos: [],
		undershirts: [],
		pants: [],
		shoes: [],
		hats: [],
		glasses: [],
		masks: [],
		accessories: [],
		earings: [],
		watches: [],
		bracelets: [],
		backpacks: []
	};

	arr.forEach((c: Clothes) => {
		if (obj[c.type]) {
			obj[c.type].push(c);
		} else {
			obj[c.type] = [c];
		}
	});

	return obj;
};

export const mapClothesPlurals: ExpectedAny = {
	tops: 'top',
	accessories: 'accessory',
	hats: 'hat',
	masks: 'mask',
	torsos: 'torso',
	backpacks: 'backpack',
	undershirts: 'undershirt'
};

export default Component;
