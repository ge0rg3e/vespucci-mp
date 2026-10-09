import React from 'react';
import { ComponentState } from '../../index';

export const types = [
	'tops',
	'undershirts',
	'torsos',
	'pants',
	'shoes',
	'hats',
	'masks',
	'backpacks',
	'watches',
	'glasses',
	'earings',
	'bracelets',
	'accessories'
];

const Component = () => {
	const { category, setCategory, settings, loadedData, setSettings, groupedClothes } =
		ComponentState();
	const { undershirtDisabled } = ComponentState();

	const onCategorySelected = (entry: ExpectedAny) => {
		if (!groupedClothes[entry]) return false; //avoiding crash
		setCategory(entry);
		if (settings.showOptions) {
			setSettings('showOptions', false);
		}
	};

	return (
		<React.Fragment>
			<div className="categories">
				<div className="entries">
					{types.map((entry, ix) => (
						<div
							className={`entry ${
								category === entry && !settings.showOptions
									? 'selected '
									: 'not-selected'
							} ${
								((entry === 'undershirts' && undershirtDisabled) || !loadedData) &&
								'disabled'
							}`}
							key={ix}
							onClick={() => onCategorySelected(entry)}
						>
							<div
								className="img"
								style={{
									backgroundImage: `url("/assets/images/systems/businesses/clothesManage/categories/${entry}.png")`
								}}
							></div>
						</div>
					))}
					<div className="divider"></div>
					<div
						className={`entry ${settings.showOptions && 'selected'}`}
						onClick={() => {
							setSettings('showOptions', true);
						}}
					>
						<div className="icon">
							<i className="elm fa-solid fa-screwdriver-wrench"></i>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
