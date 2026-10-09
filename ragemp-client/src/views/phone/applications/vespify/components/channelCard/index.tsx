import React from 'react';

// Context
import { AppState } from '../..';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './lang';

// Language translation
const languagePackId = `phone.vespify.channelCard`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = (props: Props) => {
	const { setScreen } = AppState();

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const openChannel = () => {
		setScreen({
			id: 'channel',
			payload: {
				id: props.data.id
			}
		});
	};

	return (
		<div
			className={`component-channelCard ${props.className || ''}`}
			onClick={props.onClick ? props.onClick : openChannel}
		>
			<div
				className="avatar"
				style={{
					backgroundImage: `url("https:${props.data.author.avatar}")`
				}}
			></div>
			<div className="details">
				<div className="name">{props.data.author.name}</div>
				<div className="tag">{props.data.author.tag}</div>
				<div className="subscribers">{props.data.author.subscribers}</div>
			</div>
			<div className="button">{lang.get('SeeChannel')}</div>
		</div>
	);
};

type Props = {
	className?: string;
	data: ChannelCard;
	onClick?: ExpectedAny;
};

export default Component;
