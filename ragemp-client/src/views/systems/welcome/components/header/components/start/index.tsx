import React, { useState, useEffect } from 'react';

import { Checkbox, ButtonBase } from '@mui/material';

// Context
import { ComponentState } from '../../../../index';

//  Language
import * as i18n from '@vmp/i18n';
import Language from './language';
const LANGUAGE_KEY = 'welcome:start';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

// Timers
let autoStartInterval: ExpectedAny = null;

const Component = () => {
	const [lastOnline, setLastOnline] = useState(null);
	const [autoStart, setAutoStart] = useState(false);
	const [willAutoStart, setWillAutoStart] = useState(false);
	const [autoStartSeconds, setAutoStartSeconds] = useState(5);
	const { isNight } = ComponentState();

	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	const getLastOnline = async () => {
		if (window.mp.fake) return false;
		const playerMeta: ExpectedAny = await window.rpc.callClient(
			'getLocalStorage',
			JSON.stringify({ id: `playerMeta` })
		);

		const { lastOnline: value } = playerMeta;

		setLastOnline(value ? value : null);
	};

	const getAutoStartState = async () => {
		const value: ExpectedAny = await window.rpc.callClient(
			'getLocalStorage',
			JSON.stringify({ id: `gameAutoStart` })
		);

		setAutoStart(value ? value : false);

		if (value) {
			setWillAutoStart(true);

			autoStartInterval = setInterval(() => {
				setAutoStartSeconds((currentNumber) => {
					let newNumber = currentNumber - 1;
					if (newNumber < 1) {
						startGame();

						if (autoStartInterval !== null) {
							// Clear timeout
							clearInterval(autoStartInterval);

							// Reset id
							autoStartInterval = null;
						}
						return currentNumber;
					}

					return newNumber;
				});
			}, 1000);
		}
	};

	const switchAutoStart = async () => {
		const newState = !autoStart;

		// Update player meta..
		window.rpc.triggerClient(
			`updateLocalStorage`,
			JSON.stringify({
				key: `gameAutoStart`,
				payload: newState
			})
		);

		if (autoStartInterval !== null) {
			// Clear interval
			clearInterval(autoStartInterval);

			// Reset id
			autoStartInterval = null;

			// Callback function
			setWillAutoStart(false);
		}

		setAutoStart(newState);
	};

	useEffect(() => {
		getLastOnline();
		getAutoStartState();

		return () => {
			if (autoStartInterval !== null) {
				// Clear interval
				clearInterval(autoStartInterval);

				// Reset id
				autoStartInterval = null;
			}
		};
	}, []);

	const startGame = async () => {
		// Inform the server we're ready to start playing..
		window.rpc.triggerServer(`welcome:startGame`);
	};

	return (
		<React.Fragment>
			<div className="start-button">
				<ButtonBase className={`content ${isNight && 'night-mode'}`} onClick={startGame}>
					<div className="label">
						{lang.get(willAutoStart ? `autoStartGame` : 'startGame', {
							seconds: autoStartSeconds
						})}
					</div>
					<div className="last-online">
						{lang.get(lastOnline ? 'lastOnline' : 'goToAuth', {
							date: lastOnline || undefined
						})}
					</div>
					<div className="character"></div>
				</ButtonBase>
				<div className="remember-me">
					<Checkbox checked={autoStart} onClick={switchAutoStart} />
					<div className="label">{lang.get('autoStartNextTime')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default Component;
