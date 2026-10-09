import React from 'react';
import { CharContext } from '../utils/context';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './menu.language';
i18n.createLanguagePack('SYSTEM_CHAR_CREATOR_MENU', LanguagePack);

const Shortcuts = () => {
	const { page, setPage } = CharContext();
	const lang = i18n.getLanguagePack('SYSTEM_CHAR_CREATOR_MENU', window.language);

	const entries = [
		{
			label: lang.get('Heritage'),
			value: `heritage`,
			icon: `fa-solid fa-dna`
		},
		{
			label: lang.get('Face'),
			value: `face`,
			icon: `fa-solid fa-head-side-mask` // Remove mask later?
		},
		{
			label: lang.get('Traits'),
			value: `traits`,
			icon: `fa-solid fa-ear` // Remove mask later?
		},
		{
			label: lang.get('Features'),
			value: `features`,
			icon: `fa-regular fa-compass-drafting` // Remove mask later?
		}
	];

	const onClickMenu = async (elm: FixableAny) => {
		setPage(elm.value);
		const isHead = ['face', 'traits', 'features'].includes(elm.value) ? true : false;
		window.rpc.triggerClient(
			'charCreator:pointCamera',
			JSON.stringify({ target: isHead ? 'head' : 'body' })
		);
	};

	return (
		<React.Fragment>
			<div className="menu-pages">
				{entries.map((elm, index) => (
					<div
						className={`entry ${page === elm.value && `active`}`}
						key={index}
						onClick={() => onClickMenu(elm)}
					>
						<i className={`icon ${elm.icon}`}></i>
						<div className="label">{elm.label}</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Shortcuts;
