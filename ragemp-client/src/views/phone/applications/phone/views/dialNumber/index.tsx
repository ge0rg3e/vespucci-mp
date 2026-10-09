import { useState, createContext, useContext } from 'react';

// Components

import Header from './components/header';
import Keys from './components/keys';
import Footer from './components/footer';

// Context
import { AppState } from '../..';
import { AudioService } from '@/services/audio';

// Context
const Context = createContext({});
export const ViewState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const { callNumber } = AppState();
	const { playAudio } = AudioService();

	const [numberDialed, setNumberDialed] = useState('');

	const onCallNumber = () => callNumber(numberDialed);

	const onKeyPressed = (key: string) => {
		const newNumber = `${numberDialed}${key}`;

		// We don't have numbers longer than 6 digits.
		if (newNumber.length > 6) return false;

		// If is any of the following...
		if (['#', '*'].includes(key)) return false;

		// Play sound
		if (key === '*') key = 'asterisk';
		if (key === '#') key = 'hash';

		// Play sound
		playAudio(`${__ASSETS__}/audios/phone/apps/call/key-${key}.mp3`, {
			identifier: `phone.dialKeys`,
			volume: 0.3
		});

		// Update dial
		setNumberDialed(`${numberDialed}${key}`);
	};

	const onDelete = () => {
		if (numberDialed.length === 0) return false;

		let str = `${numberDialed}`;

		if (str.length > 0) {
			str = str.slice(0, -1);
			setNumberDialed(str);
		}
	};

	const ContextProps = {
		onDelete,
		numberDialed,
		onKeyPressed,
		onCallNumber
	};

	return (
		<Context.Provider value={ContextProps}>
			<Header />
			<Keys />
			<Footer />
		</Context.Provider>
	);
};

export default Component;
