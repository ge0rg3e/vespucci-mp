import React from 'react';

// Components
import Heading from '../components/heading';
import Option from '../components/option';

// Forms
import Dropdown from '../components/forms/dropdown';
import Boolean from '../components/forms/boolean';

// Context
import { PauseState } from '../../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './gameplay.lang';
const LanguageSystemId = 'pause.sections.gameplay';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { settings, updateSettings } = PauseState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const getLanguageOptions = () => {
		return [
			{
				label: lang.get(`LanguageLabel:RO`),
				value: 'RO'
			},
			{
				label: lang.get(`LanguageLabel:EN`),
				value: 'EN'
			}
		];
	};

	return (
		<React.Fragment>
			<div className="component-section">
				<Heading
					icon="fa-sharp fa-solid fa-solar-system"
					title={lang.get('HeadingLabel')}
					description={lang.get('HeadingDescription')}
				/>
				<div className="component-options">
					<Option
						label={lang.get('OptionLabel:Language')}
						component={
							<Dropdown
								currentValue={settings.language}
								options={getLanguageOptions()}
								onChange={(value: ExpectedAny) => {
									updateSettings({
										language: value
									});

									// Instant update language
									window.language = value;
								}}
							/>
						}
					/>
					<Option
						label={lang.get('OptionLabel:SeeYourOwnNametag')}
						component={
							<Boolean
								currentState={settings.displayOwnNametag}
								labels={{
									true: lang.get('BooleanText:Yes'),
									false: lang.get('BooleanText:No')
								}}
								onChange={(value: boolean) => updateSettings({ displayOwnNametag: value })}
							/>
						}
					/>

					<Option
						label={lang.get('OptionLabel:ShowFPS')}
						component={
							<Boolean
								currentState={settings.showFPS}
								labels={{
									true: lang.get('BooleanText:Yes'),
									false: lang.get('BooleanText:No')
								}}
								onChange={(value: boolean) => updateSettings({ showFPS: value })}
							/>
						}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
