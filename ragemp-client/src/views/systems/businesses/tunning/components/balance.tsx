import { formatNumber } from '@/utils/helpers';
import { ComponentState } from '..';
import React from 'react';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:balanceLabelas';
import LanguagePack from './balance.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data } = ComponentState();

	const balanceLang = getLanguagePack(LanguageSystemId, window.language);

	return (
		<React.Fragment>
			<div className="component-balance">
				<div className="text">{balanceLang.get('yourBalance')}</div>
				<div className="value">{formatNumber(data.balance, true)}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
