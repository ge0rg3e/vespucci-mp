import React, { useContext, createContext, useEffect, useState, useRef } from 'react';

// Context
const Context: ExpectedAny = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Cart context
import CartContext from './contexts/cart';

// Dependencies
import SimulatedResponse from './response';
import { useStateRef } from '@/utils/helpers';

// Components
import Header from './components/header';
import Menu from './components/menu';
import Sidebar from './components/sidebar';

const Component = () => {
	const [data, setData, dataRef] = useStateRef(null);

	const onDataReceived = (args: ExpectedAny) => {
		// When we receive full data or just the new balance.
		const currentData = dataRef.current ? { ...dataRef.current } : {};
		setData({ ...currentData, ...args });
	};

	useEffect(() => {
		// Set up the events..
		window.socket.on('shop:receivedData', onDataReceived);

		// Request the data..
		if (!window.mp.fake) {
			window.rpc.triggerServer('shop:requestInterfaceData');
		} else {
			window.socket.simulateOn('shop:receivedData', SimulatedResponse);
		}

		return () => {
			// Close this..
			window.socket.off('shop:receivedData');

			// Inform the server
			window.rpc.triggerServer(`shop:onInteraceClosed`);
		};
	}, []);

	/* Used mainly by the tooltip to get the data about this item. */
	const getItemById = (id: string) => {
		const match = dataRef.current.items.find((i: ExpectedAny) => i.id === id);
		if (match) return match;
		return null;
	};

	const ContextProps = {
		data,
		dataRef,
		setData,
		getItemById
	};

	if (data === null) return null;

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<CartContext>
					<div className="business system-shop">
						<div className="layout-container">
							<Header />
							<div className="layout-content">
								<Menu />
								<Sidebar />
							</div>
						</div>
						<BackgroundImage />
					</div>
				</CartContext>
			</Context.Provider>
		</React.Fragment>
	);
};

const BackgroundImage = () => {
	return (
		<React.Fragment>
			<img
				src={`/assets/images/systems/businesses/shops/background.png`}
				onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
				onContextMenu={(e) => e.preventDefault()}
				onDragStart={(e) => e.preventDefault()}
				className={`background`}
			/>
		</React.Fragment>
	);
};

export default Component;
