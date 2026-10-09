import React, { useEffect } from 'react';
import { WalkieContext } from '..';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { setUsable, setFrequency, setScreen, raised, setRaised, setEnabled } = WalkieContext();
	const { setWalkieTalkieVisible } = AppContext();

	const onSetUsable = async (args: string) => {
		const { usable } = JSON.parse(args);
		setUsable(usable);
	};

	const onSetEnabled = async (args: string) => {
		const { enabled } = JSON.parse(args);
		setEnabled(enabled);
	};

	const onSetRaised = async (args: string) => {
		const { raised } = JSON.parse(args);

		// When is now raised down we go back to also avoid the bug with Space on Input focus.
		if (raised === false) {
			setScreen('home');
		}

		setRaised(raised);
	};

	const onSetFrequency = async (args: string) => {
		const { frequency } = JSON.parse(args);
		setFrequency(frequency);
	};

	useEffect(() => {
		setWalkieTalkieVisible(raised);
	}, [raised]);

	useEffect(() => {
		window.rpc.on(`walkieTalkie:setUsable`, onSetUsable);
		window.rpc.on(`walkieTalkie:setRaised`, onSetRaised);
		window.rpc.on(`walkieTalkie:setEnabled`, onSetEnabled);
		window.rpc.on(`walkieTalkie:setFrequency`, onSetFrequency);

		return () => {
			window.rpc.off(`walkieTalkie:setUsable`, onSetUsable);
			window.rpc.off(`walkieTalkie:setEnabled`, onSetEnabled);
			window.rpc.off(`walkieTalkie:setRaised`, onSetRaised);
			window.rpc.off(`walkieTalkie:setFrequency`, onSetFrequency);
		};
	}, []);

	return null;
};

export default Component;
