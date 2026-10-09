import React from 'react';

// Components
import Heading from '../components/heading';
import Option from '../components/option';

// Forms
import Boolean from '../components/forms/boolean';

// Context
import { PauseState } from '../../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './chats.lang';
const LanguageSystemId = 'pause.sections.chats';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { settings, updateSettings } = PauseState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getChatChannels = () => {
		return ['premium', 'gang', 'faction', 'admin', 'staff', 'newbie'];
	};

	return (
		<React.Fragment>
			<div className="component-sections">
				<Heading
					icon="fa-regular fa-comments"
					title={lang.get('HeadingLabel')}
					description={lang.get('HeadingDescription')}
				/>
				<div className="component-options">
					{getChatChannels().map((channel, ix) => (
						<Option
							key={ix}
							label={lang.get(`channelLabel:${channel}`)}
							component={
								<Boolean
									currentState={settings.chats[channel]}
									labels={{
										true: lang.get('BooleanText:Enabled'),
										false: lang.get('BooleanText:Disabled')
									}}
									onChange={(value: boolean) =>
										updateSettings({
											chats: {
												...settings.chats,
												[channel]: value
											}
										})
									}
								/>
							}
						/>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
