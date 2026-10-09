import React from 'react';

// Depdenencies
import { AppState } from '../../..';
import { getMenuItems } from './menuItems';

// Phone components
import List from '@phone/components/ui/list';

const Component = (props: ExpectedAny) => {
	const { data } = AppState();

	const menuItems = getMenuItems(props.lang, data);

	return (
		<React.Fragment>
			<List
				onSelection={props.onItemSelected}
				theme="light"
				items={menuItems.map((item: FixableAny) => ({
					label: item.label,
					value: item.payload.type.includes('toggle') ? (
						<React.Fragment>
							<div className="app-component-switch">
								<div className={`switch-elm ${item.payload.state && `checked`}`}>
									<div
										className={`value ${
											item.payload.state ? 'checked' : 'not-checked'
										}`}
									></div>
								</div>
							</div>
						</React.Fragment>
					) : (
						<div className="arrow-right">
							<i className="elm fa-solid fa-chevron-right"></i>
						</div>
					),
					payload: item.payload
				}))}
			/>
		</React.Fragment>
	);
};

export default Component;
