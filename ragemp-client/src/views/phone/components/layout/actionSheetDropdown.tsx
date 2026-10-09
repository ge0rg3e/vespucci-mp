import React, { useEffect, useState } from 'react';

// Context
import { PhoneState } from '@phone/index';

const Component = () => {
	const { route } = PhoneState();

	const [data, setData] = useState<ExpectedAny>(null);

	useEffect(() => setData(null), [route]);

	const dismissActionSheet = () => {
		setData(null);
	};

	window.phone.showActionSheetDropdown = (args) => {
		setData({
			title: args.title,
			description: args.description,
			cancel: args.cancel,
			options: args.options.map((btn) => {
				const { text, color = 'blue', onSelection } = btn;
				return {
					text,
					color,
					onSelection
				};
			})
		});
	};

	if (data === null) return null;

	return (
		<React.Fragment>
			<div className={`device-component-actionsheetdropdown ${window.phone.theme}`}>
				<div className="modal">
					<div className="content">
						<div className="head">
							<div className="title">{data.title}</div>
							<div className="description">{data.description}</div>
						</div>
						<div className="options">
							{data.options.map((opt: FixableAny, ix: number) => (
								<div
									key={ix}
									className={`entry ${opt.color}`}
									onClick={() => opt.onSelection({ dismiss: dismissActionSheet })}
								>
									{opt.text}
								</div>
							))}
						</div>
					</div>
					{data.cancel && (
						<div
							className="cancel"
							onClick={() => data.cancel.onCancel({ dismiss: dismissActionSheet })}
						>
							{data.cancel.text}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;

type callBackArgs = {
	dismiss: () => void;
};

type Options = {
	text: string;
	color?: 'red' | 'blue';
	onSelection: (p1: callBackArgs) => void;
};

type Cancel = {
	text: string;
	onCancel: (p1: callBackArgs) => void;
};

declare global {
	interface Phone {
		showActionSheetDropdown: (args: {
			title: string;
			description: string;
			options: Array<Options>;
			cancel: Cancel;
		}) => void;
	}
}
