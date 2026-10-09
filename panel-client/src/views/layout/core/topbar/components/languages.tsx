import { AppContext } from '@/utils/context';
import React from 'react';

// Components
import { ButtonBase } from '@mui/material';

export const availableLanguages = [
	{ code: 'RO', label: 'Romanian' },
	{ code: 'EN', label: 'English' }
];

const Component = (props: ExpectedAny) => {
	const { account, language, setLanguage } = AppContext();

	const openMenu = async () => {
		props.setDropdownMenuId(props.dropdownMenuId === 'languages' ? null : 'languages');
		props.setSiteNavigationOpened(false);
	};

	const onChangeLanguage = async (code: string) => {
		if (code === language) return openMenu();

		window.localStorage.setItem('language', code);
		setLanguage(code);

		openMenu();
	};

	return (
		<React.Fragment>
			<div className="layout-language">
				<ButtonBase className="content" onClick={openMenu}>
					<div
						className="current-flag"
						style={{
							backgroundImage: `url("/assets/images/flags/${language}.png")`
						}}
					></div>
				</ButtonBase>

				<div className={`layout-languages-menu ${!account && 'left-sided'} ${props.dropdownMenuId === 'languages' ? 'opened' : `not-opened`}`}>
					<div className="menu-items">
						<div className="arrow-up"></div>
						{availableLanguages.map((entry, ix) => (
							<div className="entry" key={ix} onClick={() => onChangeLanguage(entry.code)}>
								<div
									className="image"
									style={{
										backgroundImage: `url("/assets/images/flags/${entry.code}.png")`
									}}
								></div>
								<div className="label">{entry.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default Component;
