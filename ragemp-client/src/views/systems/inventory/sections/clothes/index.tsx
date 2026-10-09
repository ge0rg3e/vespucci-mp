import React, { useEffect } from 'react';
import { ComponentState } from '../..';

// Components
import Clothing from './components/entry';

const Component = () => {
	const { isDarkEnvironment, refs } = ComponentState();

	const onContextMenu = (event: FixableAny) => {
		const type = event.target.getAttribute('data-type');

		// Not clothing.
		if (!type || type !== 'clothing') return false;
		event.preventDefault();
		const clothesType = event.target.getAttribute('data-clothes-type');
		window.rpc.triggerServer(
			'clothing:removePedClothing',
			JSON.stringify({ type: clothesType, remoteId: refs.current.data.remoteId })
		);
	};

	useEffect(() => {
		document.addEventListener('contextmenu', onContextMenu);
		return () => {
			document.removeEventListener('contextmenu', onContextMenu);
		};
		// eslint-disable-next-line
	}, []);

	const getClothingComponents = (side: 'left' | 'right') => {
		let leftSide = ['hat', 'mask', 'top', 'undershirt', 'pants', 'shoes'];

		let rightSide = ['glasses', 'earings', 'bracelets', 'watches', 'accessory', 'backpack'];

		if (side === 'left') return leftSide;

		return rightSide;
	};

	return (
		<React.Fragment>
			<div className={`clothes ${isDarkEnvironment && 'night'}`}>
				<div className="entries grid-items-framework grid-clothes left-side">
					{getClothingComponents('left').map((id, key) => (
						<Clothing key={key} type={id} />
					))}
				</div>
				<div className="ped">
					<div className="image"></div>
				</div>
				<div className="entries grid-items-framework grid-clothes right-side">
					{getClothingComponents('right').map((id, key) => (
						<Clothing key={key} type={id} />
					))}
				</div>
 			</div>
		</React.Fragment>
	);
};

export default Component;
