import React from 'react';
import { EntryProps } from './types';
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';

// Language
import Language from './entry.language';
createLanguagePack(`hud:Toasts`, Language);

const Component = (props: EntryProps) => {
	const lang = getLanguagePack('hud:Toasts', window.language);

	return (
		<React.Fragment>
			<div
				id={`toast-${props.index}`}
				className={`entry ${props.data.type} ${props.data.visible && 'visible'}`}
				onClick={() => props.onDelete()}
			>
				<div className={`icon ${props.data.type}`}>
					{notificationsIcons[props.data.type]}
				</div>
				<div className="details">
					<div className={`label ${props.data.type}`}>
						{props.data.heading
							? props.data.heading
							: lang.get(`Heading:${props.data.type}`)}
					</div>
					<div className="message">{props.data.message}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const notificationsIcons: UndefinedAny = {
	success: <i className="elm fa-solid fa-circle-check"></i>,
	error: <i className="elm fa-solid fa-circle-exclamation"></i>,
	warning: <i className="elm fa-solid fa-triangle-exclamation"></i>,
	info: <i className="elm fa-solid fa-circle-info"></i>
};

export default Component;
