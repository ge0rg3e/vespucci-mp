import { formatNumber } from '@/utils/helpers';
import React from 'react';
import { ComponentState } from '../../..';

const Component = (props: ExpectedAny) => {
	const { data } = ComponentState();

	return (
		<div
			className={`clothing-entry ${props.isSelected && 'selected'} ${
				props.onlyChild && 'onlyChild'
			}`}
			onClick={props.onClick}
		>
 			<div className="details">
				<div className={`name ${props.data.name.length < 1 ? 'nameless' : ''}`}>
					{props.data.name || 'Nameless'}
				</div>
			</div>
			<div className="prices">
				{!props.data.price && !props.data.bcPrice && <div className="entry free">Free</div>}
				{props.data.price ? (
					<div className={`entry cash ${props.data.price > data.balance.cash && 'low'}`}>
						{formatNumber(props.data.price, true)}
					</div>
				) : null}
				{props.data.bcPrice ? (
					<div
						className={`entry bc ${
							props.data.bcPrice > data.balance.beachCoins && 'low'
						}`}
					>
						{formatNumber(props.data.bcPrice, false)} BC
					</div>
				) : null}
			</div>
		</div>
	);
};
export default Component;
