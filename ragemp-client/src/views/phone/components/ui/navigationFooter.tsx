import React from 'react';

interface Props {
	theme?: 'light' | 'dark' | 'system';
	items: Array<{ label?: string; icon: string; payload: FixableAny }>;
	isSelected: FixableAny;
	onItemSelected: FixableAny;
	variant?: 'default' | 'icon-only';
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	return (
		<React.Fragment>
			<div className={`app-navigation-footer ${componentTheme} ${props.variant}`}>
				{props.items.map((entry: FixableAny, ix: number) => (
					<div
						key={ix}
						className={`item ${props.isSelected(entry) && `selected`}`}
						onClick={() => props.onItemSelected(entry)}
					>
						<div className="icon">
							<i className={`elm ${entry.icon}`}></i>
						</div>
						{entry.label && <div className="label">{entry.label}</div>}
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
