import React, { useEffect, useState } from 'react';

// Language
import Language from './index.lang';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import { logError } from '@/utils/helpers';
import { WalkieContext } from '../..';
createLanguagePack(`walkieTalkie.setFrequency`, Language);

const Component = () => {
	const { setScreen, antiStateSpam, setAntiStateSpam } = WalkieContext();
	const [inputValue, setInputValue] = useState(null);
	const lang = getLanguagePack('walkieTalkie.setFrequency', window.language);

	const onInputValueChange = (ev: ExpectedAny) => {
		const value = ev.target.value;

		// Use regex to check if the value contains only digits (0-9)
		if (!/^[0-9]*$/.test(value)) return false;

		// If is a number longer than 4.
		if (value.toString().length > 4) return false;

		// Update value
		setInputValue(value);
	};

	const submitFrequency = async () => {
		try {
			// Hasn't wrote anything.
			if (inputValue === null) return false;

			// Wait..
			if (antiStateSpam.setFrequency === true) return false;

			// Prevent spamming the server
			setAntiStateSpam((currentState: ExpectedAny) => ({
				...currentState,
				setFrequency: true
			}));

			// Reset in one second
			setTimeout(() => {
				setAntiStateSpam((currentState: ExpectedAny) => ({
					...currentState,
					setFrequency: false
				}));
			}, 1000);

			// Ask the server to join this frequency
			await window.rpc.callServer(
				`walkieTalkie:setFrequency`,
				JSON.stringify({ frequency: parseInt(inputValue) })
			);

			// Set route to main screen
			setScreen('home');
		} catch (err) {
			await logError(`walkieTalkie.submitFrequency`, err);
		}
	};

	const disabledForNow = async () =>
		window.toast({ type: 'info', message: `This feature will be added later` });

	// Auto focus
	useEffect(() => {
		// Focus onto input
		const div = document.getElementById(`frequency-input`);

		// Focus..
		if (div) {
			div.focus();
		}
	}, []);

	return (
		<div className="container setFrequency">
			<div className="header">{lang.get('HeaderTitle')}</div>
			<div className="content">
				<input
					id="frequency-input"
					value={inputValue || ''}
					onChange={onInputValueChange}
					className="input"
					type="number"
					placeholder="0000"
				/>
			</div>
			<div className="footer">
				<div className="type" onClick={disabledForNow}>
					<div className="icon">
						<i className="elm fa-solid fa-chevron-down"></i>
					</div>
					<div className="text">G</div>
				</div>
				<div className="button" onClick={submitFrequency}>
					{lang.get('ButtonText')}
				</div>
			</div>
		</div>
	);
};

export default Component;
