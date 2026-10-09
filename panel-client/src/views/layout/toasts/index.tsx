import React, { useEffect, useRef, useState } from 'react';

let intervalTimer: FixableAny = null;

// Components
import Entry from './components/entry';

const Component = () => {
	const [toasts, setToasts] = useState<FixableAny>([]);
	const toastsRef = useRef([]);

	useEffect(() => {
		toastsRef.current = toasts;
	}, [toasts]);

	const createToast = (data: ExpectedAny) => {
		const toastObject: FixableAny = {
			type: data.type || 'info',
			message: data.message,
			secondsLeft: data.seconds,
			secondsTimer: data.seconds,
			date: new Date().toUTCString()
		};

		setToasts((currentState: ExpectedAny) => {
			const arr = [...currentState];
			arr.push(toastObject);
			return arr;
		});
	};

	useEffect(() => {
		// Create instance..
		window.toasts = {
			push: (message: string, type: 'success' | 'error' | 'warning' | 'info', seconds: number = 5) => createToast({ message, seconds, type }),
			reset: () => setToasts([])
		};

		intervalTimer = setInterval(() => {
			if (toastsRef.current.length < 1) return false;
			setToasts((currentState: ExpectedAny) => {
				const arr = [...currentState];

				arr.forEach((_, index) => {
					if (arr[index].secondsLeft < 0.01) return;
					arr[index].secondsLeft -= 0.1;
				});

				const persistingOnes = arr.filter((en) => en.secondsLeft > 0.01);

				if (persistingOnes.length < 1) return [];

				return arr;
			});
		}, 100);

		return () => {
			clearInterval(intervalTimer);
		};
	}, []);

	const notificationsIcons: UndefinedAny = {
		success: <i className="icon fa-light fa-circle-check"></i>,
		error: <i className="icon fa-light fa-circle-exclamation"></i>,
		warning: <i className="icon fa-light fa-circle-radiation"></i>,
		info: <i className="icon fa-light fa-circle-info"></i>
	};

	const deleteToast = (index: number) => {
		setToasts((currentState: ExpectedAny) => {
			const arr = [...currentState];
			arr[index].secondsLeft = 0;
			return arr;
		});
	};

	return (
		<div className="layout-toasts">
			{toasts
				.sort((a: FixableAny, b: FixableAny) => b.date - a.date)
				.slice(0, 4)
				.map((entry: FixableAny, index: number) => (
					<Entry onClick={() => deleteToast(index)} index={index} data={entry} key={index} icon={notificationsIcons[entry.type]} />
				))}
		</div>
	);
};

declare global {
	interface Window {
		toasts: {
			push: (message: string, type: 'success' | 'error' | 'warning' | 'info', seconds?: number) => ExpectedAny;
			reset: () => ExpectedAny;
		};
	}
}

export default Component;
