import React, { useEffect, useState } from 'react';
import { ComponentState } from '..';
import { Tooltip } from '@mui/material';

export const types = [
	'tops',
	'undershirts',
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

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './categories.language';
import { logError } from '@/utils/helpers';
const LanguageSystemId = 'buyClothes:categories';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { itemId, category, setCategory, data } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);
	const [undershirtDisabled, setUndershirtDisabled] = useState(true);

	const onSelectCategory = (cat: ExpectedAny) => {
		if (cat === 'undershirts' && undershirtDisabled) return false;
		setCategory(cat);
	};

	const getRightTooltipPlacement = (cat: string) => {
		if (cat === 'masks' || cat === 'accessories') return 'left';
		if (cat === 'bracelets') return 'top';
		return 'right';
	};

	const changeCameraFocus = () => {
		let newTarget = 'body';

		if (category === 'shoes') {
			newTarget = 'foot';
		} else if (['masks', 'earings', 'glasses', 'hats'].includes(category)) {
			newTarget = 'head';
		}

		window.rpc.triggerClient(
			'clothesBusiness:PointCamera',
			JSON.stringify({ target: newTarget })
		);
	};

	useEffect(() => {
		changeCameraFocus();

		// Re-apply clothing when changing cats
		window.rpc.triggerServer(
			'clothing:applyPedClothing',
			JSON.stringify({
				clothes: {
					...data.clothing
				}
			})
		);
	}, [category]);

	const checkUndershirtDisabled = async () => {
		try {
			const topDetails: ExpectedAny = await window.rpc.callServer(
				'buyClothes:getClothingTopDetails',
				JSON.stringify({ id: `current` })
			);

			const response = topDetails ? (topDetails.undershirtCompatible ? false : true) : true;
			setUndershirtDisabled(response);
		} catch (err) {
			await logError(`CHECK_UNDERSHIRT_DISABLED`, err);
		}
	};

	useEffect(() => {
		checkUndershirtDisabled();
	}, [itemId, data]);

	return (
		<React.Fragment>
			<div className="comp-categories">
				<div className="comp-content">
					<div className="entries">
						{types.map((entry, ix) => (
							<div
								key={ix}
								className={`entry ${entry === category ? 'selected' : ''} ${
									entry === 'undershirts' && undershirtDisabled ? 'disabled' : ''
								}`}
								onClick={() => onSelectCategory(entry)}
							>
								<Tooltip
									PopperProps={{
										className: 'clothesBuy-category-tooltip-popper'
									}}
									placement={getRightTooltipPlacement(entry)}
									title={
										<React.Fragment>
											<div className="title">
												{lang.get(`category:${entry}`)}
											</div>
											{entry == 'undershirts' && undershirtDisabled && (
												<div className="description">
													{lang.get('notCompatibleWithOuterWear')}
												</div>
											)}
										</React.Fragment>
									}
									arrow
								>
									<div className="content">
										<div
											className="img"
											style={{
												backgroundImage: `url("/assets/images/systems/businesses/clothesManage/categories/${entry}.png")`
											}}
										></div>
									</div>
								</Tooltip>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
