import React, { createContext, useContext, useState, useEffect } from 'react';

// Context
const Context: ExpectedAny = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

// Components
import Header from './components/header';
import Footer from './components/footer';

const Component = () => {
	const [isNight, setIsNight] = useState(false);

	const onNightCallback = (args: string) => {
		const { value } = JSON.parse(args);
		setIsNight(value);
	};

	useEffect(() => {
		window.rpc.on('welcome:setIsNight', onNightCallback);
		return () => {
			window.rpc.off('welcome:setIsNight', onNightCallback);
		};
	}, []);

	const PassedProps = {
		isNight,
		setIsNight
	};

	return (
		<div className="system-welcome">
			<Context.Provider value={PassedProps}>
				<Header />
				<Footer />
			</Context.Provider>
		</div>
	);
};

export default Component;
