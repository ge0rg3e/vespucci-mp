import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

// Contexts
import { AppContext } from '@/utils/context';
import { AudioService } from '@/services/audio';

// Components
import Entry from './components/entry';
import { useStateRef } from '@/utils/helpers';

// Variable
let intervalTimer: UndefinedAny = null;

const ExportingComponent = () => {
	const [lastAudioTiming, setLastAudioTiming] = useState<ExpectedAny>(null);
	const [visibility, setVisibility] = useState<boolean>(true);
	const location = useLocation();
	const [pathName, setPathName, pathNameRef] = useStateRef(location.pathname);

	// Context
	const {
		gameHudHidden,
		gameHudHiddenRef,
		takingScreenshotInGameRef,
		takingScreenshotInGame,
		isDarkEnvironment,
		alerts: data,
		setAlerts: setData
	} = AppContext();

	const { playAudio } = AudioService();

	const maxAlertsVisible = 3;

	const onEventCreate = (args: ExpectedAny) => {
		const { heading, message, type, seconds = 7, silent = false, system = '' } = JSON.parse(args);

		const obj: FixableAny = {
			id: uuidv4(),
			type: type || 'info',
			heading: heading || '',
			message: message,
			seconds: seconds,
			date: new Date().toUTCString(),
			visible: false,
			silent,
			system
		};

		setData((currentState: ExpectedAny) => {
			const arr = [...currentState];
			arr.push(obj);
			return arr;
		});

		// If the timer is not running the it means it should be started.
		if (intervalTimer === null) {
			intervalTimer = setInterval(() => onTaskRunning(), 1000);
		}
	};

	const onDataChanged = () => {
		if (pathName !== '/') return; // So the sound will be made when it's there focused on main hud.

		const visibleEntries = data.sort((a: FixableAny, b: FixableAny) => a.date - b.date).slice(0, maxAlertsVisible);

		visibleEntries.forEach((v: ExpectedAny) => {
			if (v.visible === true) return; // Nothing to do.

			const lastAudioTimingPassed = moment(new Date()).diff(new Date(lastAudioTiming), 'seconds') > 0.3 ? true : false;

			// Play notification
			if ((lastAudioTimingPassed === true || lastAudioTiming == null) && v.silent === false && pathName === '/') {
				playAudio(`${__ASSETS__}/audios/systems/alerts/${v.type}.mp3`, { volume: 0.2 });
				setLastAudioTiming(new Date());
			}

			setData((currentState: ExpectedAny) => {
				const arr = [...currentState];

				const index = arr.findIndex((e: ExpectedAny) => e.id === v.id);
				if (index == -1) return arr;

				arr[index].visible = true;

				return arr;
			});
		});
	};

	useEffect(() => {
		onDataChanged();
	}, [data]);

	useEffect(() => {
		setPathName(location.pathname);
	}, [location.pathname]);

	const onEventClears = () => setData([]);

	const onTaskRunning = () => {
		setData((currentState: ExpectedAny) => {
			let arr = [...currentState];

			// We don't run the task now.
			if (gameHudHiddenRef.current === true && takingScreenshotInGameRef.current === true) return arr;

			if (pathNameRef.current !== '/') return arr;

			const visibleEntries = arr.sort((a: FixableAny, b: FixableAny) => a.date - b.date).slice(0, maxAlertsVisible);

			arr.forEach((e, index) => {
				if (arr[index].seconds < 1) return;

				// Is not part of the visible ones, therefore it should not expire until is visible so the player can see it.
				if (!visibleEntries.find((v) => v.id === e.id)) return;
				arr[index].seconds -= 1;
			});

			arr = arr.filter((e) => e.seconds > 1);

			// The array ended then is fine to stop it.
			if (arr.length < 1 && intervalTimer !== null) {
				// Clear  interval
				clearInterval(intervalTimer);

				// Reset interval timer
				intervalTimer = null;
			}

			return arr;
		});
	};

	const onClearAlertsFromSystem = (args: string) => {
		const { id } = JSON.parse(args);

		setData((currentState: ExpectedAny) => currentState.filter((c: ExpectedAny) => c.system !== id));
	};

	const onSetVisibility = (args: ExpectedAny) => {
		const { boolean } = JSON.parse(args);
		setVisibility(boolean);
	};

	// Clear the interval on dismounting
	useEffect(
		() => () => {
			if (intervalTimer !== null) {
				// Clear interval
				clearInterval(intervalTimer);

				// Reset timer id
				intervalTimer = null;
			}
		},
		[]
	);

	useEffect(() => {
		window.rpc.on(`alerts:setVisibility`, onSetVisibility);
		window.rpc.on(`alerts:create`, onEventCreate);
		window.rpc.on(`alerts:clear`, onEventClears);
		window.rpc.on(`alerts:clearAlertsFromSystem`, onClearAlertsFromSystem);

		return () => {
			window.rpc.off(`alerts:setVisibility`, onSetVisibility);
			window.rpc.off(`alerts:create`, onEventCreate);
			window.rpc.off(`alerts:clear`, onEventClears);
			window.rpc.off(`alerts:clearAlertsFromSystem`, onClearAlertsFromSystem);
		};
	}, []);

	// The alerts are only visible when is the main hud.
	if (pathName !== '/') return null;

	return (
		<React.Fragment>
			<div
				className={`hud-alerts ${isDarkEnvironment ? 'night-mode' : ''}`}
				style={{
					visibility: visibility === true ? 'visible' : 'hidden',
					opacity: gameHudHidden === true && takingScreenshotInGame === true ? 0 : 1
				}}
			>
				{data
					.sort((a: FixableAny, b: FixableAny) => a.date - b.date)
					.slice(0, maxAlertsVisible)
					.map((entry: FixableAny, index: number) => (
						<Entry index={index} data={entry} key={index} />
					))}
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
