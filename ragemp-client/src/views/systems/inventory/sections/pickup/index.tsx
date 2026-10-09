import React from 'react';
import { ComponentState } from '../..';

// Dependencies
import { generateEmptyArray } from '@/utils/helpers';

// Components
import DroppedItem from './components/entry';

const Component = () => {
	const { lang, data, getItemMeta, activeDragType, isDarkEnvironment } = ComponentState();

	const getItemProps = (index: number) => {
		const dropData = data.nearbyPickups[index];
		if (dropData) {
			const meta = getItemMeta(dropData.itemId);
			return {
				data: dropData,
				itemMeta: meta
			};
		} else
			return {
				data: null,
				meta: null,
				emptySlot: true
			};
	};

	return (
		<React.Fragment>
			<div className="pickup-area">
				<div className="heading">{lang.get('ItemsOnTheGround')}</div>
				<div className={`items ${isDarkEnvironment && `night`}`}>
					<div className={`entries grid-items-framework grid-items`} id="pickup-entries">
						{generateEmptyArray(6).map((_, index) => (
							<DroppedItem key={index} {...getItemProps(index)} />
						))}
					</div>
					{activeDragType === 'item' && (
						<div className="drop-area throw" data-type="drop-items-zone">
							<div className="icon-container">
								<i className=" elm fa-solid fa-dumpster"></i>
							</div>
							<div className="text">{lang.get('DropItemHere')} </div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
