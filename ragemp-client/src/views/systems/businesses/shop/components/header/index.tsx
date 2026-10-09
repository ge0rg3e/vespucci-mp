import React from 'react';

// Context
import { ComponentState } from '../..';
import { formatNumber } from '@/utils/helpers';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './language';
const LanguageSystemId = 'business:shop:header';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	return (
		<div className="layout-header">
			<div className="left-side">
				<div className="logo">
					<div className="icon">
						<i className="elm fa-solid fa-shop"></i>
					</div>
				</div>
				<div className="divider"></div>
				<div className="title">{data.title}</div>
			</div>
			<div className="right-side">
				<div className="balance">
					<div className="label">{lang.get('YourBalance')}</div>
					<div className="value">{formatNumber(data.localInfo.balance.cash, true)}</div>
				</div>
			</div>
		</div>
	);
};

export default Component;
