import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// Contexts
import { AppContext } from '@/utils/context';
import { AudioService } from '@/services/audio';

// Components
import Entry from './components/entry';

// Variable
let intervalTimer: UndefinedAny = null;

const ExportingComponent = () => {
	const [data, setData] = useState<FixableAny>([]);
	const [lastAudioTiming, setLastAudioTiming] = useState<ExpectedAny>(null);

	// Context
	const { gameHudHidden, gameHudHiddenRef, takingScreenshotInGameRef, takingScreenshotInGame, isDarkEnvironment } = AppContext();
	const { playAudio } = AudioService();

	const maxToastsVisible = 5;

	const onEventCreate = (args: ExpectedAny) => {
		const { heading, message, type, seconds = 7, silent = false } = typeof args === 'string' ? JSON.parse(args) : args;

		const obj: FixableAny = {
			id: uuidv4(),
			type: type || 'info',
			heading: heading || '',
			message: message,
			seconds: seconds,
			date: new Date().toUTCString(),
			visible: false,
			silent
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
		const visibleEntries = data.sort((a: FixableAny, b: FixableAny) => a.date - b.date).slice(0, maxToastsVisible);

		visibleEntries.forEach((v: ExpectedAny) => {
			if (v.visible === true) return; // Nothing to do.

			const lastAudioTimingPassed = moment(new Date()).diff(new Date(lastAudioTiming), 'seconds') > 0.3 ? true : false;

			// Play notification
			if ((lastAudioTimingPassed === true || lastAudioTiming == null) && v.silent === false) {
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
		window.toasts = data.filter((e: ExpectedAny) => e.visible);
	}, [data]);

	const onEventClears = () => setData([]);

	const onTaskRunning = () => {
		setData((currentState: ExpectedAny) => {
			let arr = [...currentState];

			// We don't run the task now.
			if (gameHudHiddenRef.current === true && takingScreenshotInGameRef.current === true) return arr;

			const visibleEntries = arr.sort((a: FixableAny, b: FixableAny) => a.date - b.date).slice(0, maxToastsVisible);

			arr.forEach((e, index) => {
				if (arr[index].seconds < 1) return;

				// Is not part of the visible ones, therefore it should not expire until is visible so the player can see it.
				if (!visibleEntries.find((v) => v.id === e.id)) return;
				arr[index].seconds -= 1;
			});

			arr = arr.filter((e) => e.seconds > 1);

			// The array ended then is fine to stop it.
			if (arr.length < 1 && intervalTimer !== null) {
				// Clear interval
				clearInterval(intervalTimer);

				// Clear timer id
				intervalTimer = null;
			}

			return arr;
		});
	};

	const deleteEntry = (id: ExpectedAny) => {
		setData((currentState: ExpectedAny) => currentState.filter((e: ExpectedAny) => e.id !== id));
	};

	useEffect(() => {
		window.toast = onEventCreate;
		window.clearToasts = onEventClears;

		return () => {
			if (intervalTimer !== null) {
				// Clear interal
				clearInterval(intervalTimer);

				// Reset timer id
				intervalTimer = null;
			}
		};
	}, []);

	useEffect(() => {
		window.rpc.on(`toasts:create`, onEventCreate);
		window.rpc.on(`toasts:clear`, onEventClears);

		return () => {
			window.rpc.off(`toasts:create`, onEventCreate);
			window.rpc.off(`toasts:clear`, onEventClears);
		};
	}, []);

	return (
		<React.Fragment>
			<div
				className={`hud-toasts ${isDarkEnvironment ? 'night-mode' : ''}`}
				style={{
					opacity: gameHudHidden === true && takingScreenshotInGame === true ? 0 : 1
				}}
			>
				{data
					.sort((a: FixableAny, b: FixableAny) => a.date - b.date)
					.slice(0, maxToastsVisible)
					.map((entry: FixableAny, index: number) => (
						<Entry index={index} data={entry} key={index} onDelete={() => deleteEntry(entry.id)} />
					))}
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
