import React from 'react';
import { ComponentState } from '../..';

const Component = () => {
	const { itemId, setItemId, changePedClothing, texturesFound } = ComponentState();

	if (texturesFound.length < 2) return null;

	return (
		<React.Fragment>
			<div className="textures">
				{texturesFound.map((entry: ExpectedAny, ix: number) => (
					<div
						key={ix}
						className={`entry ${itemId === entry.id && 'selected'} ${
							entry.isAvailable === true && 'in-store'
						}`}
						onClick={() => {
							setItemId(entry.id);
							changePedClothing(
								entry.type,
								{
									drawableId: entry.drawableId,
									textureId: entry.textureId,
									isAddon: entry.isAddon
								},
								entry.meta
							);
						}}
					>
						<div className={`content ${entry.name.length < 1 && 'nameless'}`}>
							{entry.textureId}
						</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
