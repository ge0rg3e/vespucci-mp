import { formatNumber, logError } from '@/utils/helpers';
import React, { useEffect } from 'react';
import { ComponentState } from '..';

// Components
import Controls from '../components/controls';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
const LanguageSystemId = 'tunning:repairLabels';
import LanguagePack from './repair.language';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { data } = ComponentState();

	const controlsLang = getLanguagePack('tunning:controlsLabels', window.language);
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getControls = () => {
		const arr = [];

		arr.push({
			label: controlsLang.get('back'),
			key: <i className="icon large fa-solid fa-delete-left"></i>
		});

		arr.push({
			label: controlsLang.get('purchase'),
			key: 'Space'
		});

		return arr;
	};

	const onPurchase = async () => {
		try {
			await window.rpc.triggerServer(
				`tunning:purchase`,
				JSON.stringify({
					type: 'repair'
				})
			);
		} catch (err) {
			await logError('onPurchase_repair', err);
		}
	};

	useEffect(() => {
		// set up events
		document.addEventListener('tunning:onPurchase', onPurchase);

		return () => {
			// set up events
			document.removeEventListener('tunning:onPurchase', onPurchase);
		};
	}, []);

	return (
		<React.Fragment>
			<div className="layout-dialog">
				<div className="content">
					<div className="title">{lang.get('title')}</div>
					<div className="prices">
						<div className="entry">
							<div className="label">{lang.get('cost')}</div>
							<div className="value">{formatNumber(data.prices.repair, true)}</div>
						</div>
					</div>
				</div>
			</div>
			<Controls keys={getControls()} />
		</React.Fragment>
	);
};
export default Component;
