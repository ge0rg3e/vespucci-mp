import React from 'react';
import { Button } from '@mui/material';

// Language
import * as i18n from '@vmp/i18n';
import Language from './exitButton.lang';
import { DealershipState } from '..';
const languagePackId = `SYSTEM_DEALERSHIP_EXIT_BUTTON`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const { categorySelected, setCategorySelected, setVehicleSelected } = DealershipState();

	const onSelect = () => {
		if (categorySelected) {
			setCategorySelected(null);
			setVehicleSelected(null);
		} else {
			window.rpc.triggerServer(`exitDealership`);
		}
	};

	return (
		<React.Fragment>
			<div className="system-exit-button">
				<Button
					variant="text"
					size="small"
					className="button"
					color="primary"
					onClick={onSelect}
				>
					{lang.get(categorySelected ? 'GoBack' : 'LeaveDealership')}
				</Button>
			</div>
		</React.Fragment>
	);
};

export default Component;
