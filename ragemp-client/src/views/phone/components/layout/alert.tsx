import React, { useEffect, useState } from 'react';

// Context
import { PhoneState } from '@phone/index';

const Component = () => {
	const { route } = PhoneState();

	const [data, setData] = useState<FixableAny>(null);

	useEffect(() => setData(null), [route]);

	const dismissAlert = () => {
		setData(null);
	};

	window.phone.showAlert = (args) => {
		setData({
			title: args.title,
			description: args.description,
			buttons: args.buttons.map((btn: FixableAny) => {
				const { text, color = 'blue', onSelection } = btn;
				return {
					text,
					color,
					onSelection
				};
			})
		});
	};

	const receivedServerEvent = (args: string) => {
		const { title, message } = JSON.parse(args);
		window.phone.showAlert({
			title,
			description: message,
			buttons: [
				{
					text: 'OK',
					color: 'blue',
					onSelection: ({ dismiss }) => dismiss()
				}
			]
		});
	};

	useEffect(() => {
		window.rpc.on('triggerAlertConfirmation', receivedServerEvent);
		return () => {
			window.rpc.off('triggerAlertConfirmation', receivedServerEvent);
		};
	}, []);
	if (data === null) return null;

	return (
		<React.Fragment>
			<div className={`device-component-alert ${window.phone.theme}`}>
				<div className="modal">
					<div className="content">
						{' '}
						<div className="title">{data.title}</div>
						{data.description && <div className="description">{data.description}</div>}
						<div className="buttons">
							{data.buttons.map((opt: FixableAny, ix: number) => (
								<div
									key={ix}
									className={`entry ${opt.color}`}
									onClick={() => opt.onSelection({ dismiss: dismissAlert })}
								>
									{opt.text}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;

type callBackArgs = {
	dismiss: () => void;
};

type Buttons = {
	text: string;
	color?: 'red' | 'blue';
	onSelection: (p1: callBackArgs) => void;
};

declare global {
	interface Phone {
		showAlert: (args: { title: string; description: string; buttons: Array<Buttons> }) => void;
	}
}
