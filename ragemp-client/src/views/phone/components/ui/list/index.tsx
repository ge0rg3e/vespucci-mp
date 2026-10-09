import { conditionalClassNames } from '@/utils/helpers';
import React from 'react';
import { PhoneState } from '@phone/index';

// Components
import ListIcon from './components/icon';

interface Props {
	loading?: boolean;
	items: Array<{
		icon?: FixableAny;
		label: string;
		value?: FixableAny;
		payload?: FixableAny;
		onSelection?: FixableAny;
	}>;
	theme?: 'light' | 'dark' | 'system';
	onSelection?: (val: ExpectedAny) => void;
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	const componentClassNames = conditionalClassNames(`entry`, [
		{
			class: `hasSelection`,
			if: props.onSelection !== undefined ? true : false
		},
		{
			class: `loading`,
			if: props.loading ? true : false
		},
		{
			class: `with-icons`,
			if: props.items[0].icon ? true : false
		}
	]);

	return (
		<React.Fragment>
			<div className={`app-component-data-list ${componentTheme}`}>
				<div className="content">
					{props.items.map((entry: FixableAny, ix: number) => (
						<div
							className={componentClassNames}
							key={ix}
							onClick={
								entry.onSelection
									? entry.onSelection
									: props.onSelection !== undefined
									? () => props.onSelection!(entry)
									: undefined
							}
						>
							{entry.icon && (
								<ListIcon data={entry.icon} componentTheme={componentTheme} />
							)}
							<div className="label">{entry.label}</div>
							{entry.value !== undefined && (
								<div className="value">{entry.value}</div>
							)}
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
