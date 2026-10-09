import React from 'react';
import { EntryProps } from './types';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';

// Language
import Language from './entry.language';
import { removeDiacritics } from '@/utils/helpers';
import { AppContext } from '@/utils/context';
createLanguagePack(`hud:Alert`, Language);

const Component = (props: EntryProps) => {
	const lang = getLanguagePack('hud:Alert', window.language);

	const { isDarkEnvironment } = AppContext();

	return (
		<React.Fragment>
			<div
				id={`toast-${props.index}`}
				className={`entry ${props.data.type} ${props.data.visible && 'visible'} ${
					isDarkEnvironment && 'dark-mode'
				}`}
			>
				<div className={`container ${props.data.type}`}>
					<div className={`icon ${props.data.type}`}>
						{notificationsIcons[props.data.type]}
					</div>
					<div className="content">
						<div className={`title ${props.data.type}`}>
							{removeDiacritics(
								props.data.heading
									? props.data.heading
									: lang.get(`Heading:${props.data.type}`)
							)}
						</div>
						<div className="message">{removeDiacritics(props.data.message)} </div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const notificationsIcons: UndefinedAny = {
	success: <i className="elm success fa-solid fa-circle-check"></i>,
	error: <i className="elm error fa-solid fa-circle-exclamation"></i>,
	warning: <i className="elm warning fa-solid fa-triangle-exclamation"></i>,
	info: <i className="elm info fa-solid fa-circle-info"></i>
};

export default Component;
