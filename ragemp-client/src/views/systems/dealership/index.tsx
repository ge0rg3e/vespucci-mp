import React, { useContext, createContext, useEffect, useState, useRef } from 'react';

// Components
import Categories from './components/categories';
import Vehicles from './components/vehicles';
import Search from './components/search';
import Information from './components/information';
import Performance from './components/performance';
import BottomRightButtons from './components/bottomRightButtons';
import Colors from './components/colors';
import ExitButton from './components/exitButton';

// Events
import ZoomAndRotate from './events/zoomAndRotate';

// Context
const Context = createContext({});
export const DealershipState: ExpectedAny = () => useContext(Context);

// Demo
import SimulatedResponse from './response';

const Component = () => {
	const [data, setData] = useState<ExpectedAny>(null);
	const [active, setActive] = useState(false);
	const [search, setSearching] = useState('');
	const [categorySelected, setCategorySelected] = useState<FixableAny>(null);
	const [vehicleSelected, setVehicleSelected] = useState(null);
	const [colors, setColors] = useState(null);
	const [interfaceHidden, setInterfaceHidden] = useState(false);

	const refs = useRef({
		vehicleSelected,
		categorySelected
	});

	useEffect(() => {
		refs.current = {
			vehicleSelected,
			categorySelected
		};
	}, [vehicleSelected, categorySelected]);

	const onDataReceived = (d: ExpectedAny) => {
		setData(d);

		// console.log(`data received`, d);
		const cats = getCategories(d);

		// If is only one category let's default to it.
		if (cats.length === 1) {
			setCategorySelected(cats[0].name);

			const firstVehicle = d.dealership.stocks.filter(
				(s: FixableAny) => s.category === cats[0].name
			)[0];

			if (firstVehicle) {
				setVehicleSelected(firstVehicle.id);
			}
		}
	};

	const onDataUpdated = (d: ExpectedAny) => {
		// If the veh is selected we must make sure is existing..
		if (refs.current.vehicleSelected) {
			const vehSelected = d.dealership.stocks.find(
				(v: ExpectedAny) => v.id === refs.current.vehicleSelected
			);

			if (!vehSelected) {
				setVehicleSelected(null);
			}
		}

		// If the category is not existing anymore..
		if (refs.current.categorySelected) {
			const catSelected = d.dealership.stocks.find(
				(v: ExpectedAny) => v.category === refs.current.categorySelected
			);

			if (!catSelected) {
				setCategorySelected(null);
				setVehicleSelected(null);
			}
		}

		// Update data..
		setData(d);
	};

	const onActiveStateChanged = (args: string) => {
		const { boolean } = JSON.parse(args);
		setActive(boolean);
	};

	const getCategories = (dataEnforced = null) => {
		const dataUsed = dataEnforced ? dataEnforced : data;

		if (dataUsed === null) return [];

		const obj: ExpectedAny = {};

		dataUsed.dealership.stocks.forEach((stock: FixableAny) => {
			if (!obj[stock.category]) {
				obj[stock.category] = {
					models: 1,
					name: stock.category
				};
			} else {
				obj[stock.category].models++;
			}
		});

		let arr: FixableAny = [];

		Object.keys(obj).forEach((key) => {
			arr.push(obj[key]);
		});

		arr = arr.sort((a: FixableAny, b: FixableAny) => a.name.localeCompare(b.name));

		return arr;
	};

	const getCategorySelected = () => {
		if (categorySelected === null) return null;
		const match = getCategories().find((x: FixableAny) => x.name === categorySelected);
		if (!match) return null;
		return match;
	};

	const getVehicles = (includeSearch = false) => {
		if (getCategorySelected() === null) return [];
		let arr = data.dealership.stocks.filter(
			(v: FixableAny) => v.category === getCategorySelected().name
		);

		if (includeSearch === true && search && search.length > 1) {
			arr = arr.filter((v: FixableAny) => {
				const model = v.model.toString().toLowerCase();
				const displayName = v.nativeInfo.displayName.toString().toLowerCase();
				const str = search.toString().toLowerCase();
				return (
					model.includes(str) ||
					str === model ||
					displayName.includes(str) ||
					displayName === str
				);
			});
		}

		return arr;
	};

	const getVehicleSelected = () => {
		if (vehicleSelected === null) return false;
		const veh = getVehicles().find((v: FixableAny) => v.id === vehicleSelected);
		if (!veh) return null;
		return veh;
	};

	const onVehicleModelChanged = () => {
		if (vehicleSelected === null) return false;

		const veh: FixableAny = getVehicleSelected();
		if (!veh) return false;

		window.rpc.triggerClient(
			'onDealershipPreviewModelChanged',
			JSON.stringify({
				model: veh.model
			})
		);
		return true;
	};

	const onInterfaceHidden = (args: string) => {
		const { bool } = JSON.parse(args);
		setInterfaceHidden(bool);
	};

	useEffect(() => {
		window.socket.on('setDealershipInterfaceData', onDataReceived);
		window.socket.on('updateDealershipInterfaceData', onDataUpdated);
		window.rpc.on('setDealershipInterfaceActiveState', onActiveStateChanged);
		window.rpc.on('hideDealershipInterface', onInterfaceHidden);

		// Faking a response so we can see the profile in the browser when simulating.
		if (window.mp.fake) {
			window.socket.simulateOn('setDealershipInterfaceData', SimulatedResponse);
			setActive(true);
		}

		return () => {
			window.socket.off('setDealershipInterfaceData');
			window.socket.off('updateDealershipInterfaceData');
			window.rpc.off('setDealershipInterfaceActiveState', onActiveStateChanged);
			window.rpc.off('hideDealershipInterface', onInterfaceHidden);
		};
	}, []);

	useEffect(() => {
		onVehicleModelChanged();
	}, [vehicleSelected]);

	const passedVariables = {
		data,
		setData,
		// Vehicles
		getVehicles,
		vehicleSelected,
		setVehicleSelected,
		getVehicleSelected,
		// Categories
		setCategorySelected,
		categorySelected,
		categories: getCategories(),
		getCategorySelected,
		// Search
		search,
		setSearching,
		// Colors
		colors,
		setColors
	};

	if (data === null || active == false) return null;

	return (
		<Context.Provider value={passedVariables}>
			<div className={`system-dealership ${interfaceHidden && 'interface-hidden'}`}>
				<div className="system-menu">
					<div className="wrapper">
						{categorySelected !== null ? (
							<div className="list">
								<div className="content">
									<Search />
									<Vehicles />
								</div>
							</div>
						) : (
							<Categories />
						)}
						<ExitButton />
					</div>
				</div>
				{categorySelected !== null && vehicleSelected !== null && (
					<React.Fragment>
						<div className="right-side-background"></div>
						<div className="system-right-side">
							<Information />
							<div className="action-area">
								<Performance />
								<Colors />
							</div>
						</div>
						<BottomRightButtons />
					</React.Fragment>
				)}
				<ZoomAndRotate />
			</div>
		</Context.Provider>
	);
};

export default Component;
