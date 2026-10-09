import React from 'react';

// Components
import Heading from '../components/heading';
import Option from '../components/option';

// Forms
import Slider from '../components/forms/slider';
import Boolean from '../components/forms/boolean';

// Context
import { PauseState } from '../../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './audio.lang';
const LanguageSystemId = 'pause.sections.audio';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { settings, updateSettings } = PauseState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	return (
		<React.Fragment>
			<div className="component-section">
				<Heading
					icon="fa-solid fa-headphones"
					title={lang.get('HeadingLabel')}
					description={lang.get('HeadingDescription')}
				/>
				<div className="component-options">
					<Option
						label={lang.get('OptionLabel:SoundEffects')}
						component={
							<Boolean
								currentState={settings.soundEffects.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										soundEffects: {
											...settings.soundEffects,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.soundEffects.enabled && (
						<Option
							label={lang.get('OptionLabel:SoundEffectsVolume')}
							component={
								<Slider
									currentValue={settings.soundEffects.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											soundEffects: {
												...settings.soundEffects,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}

					<Option
						label={lang.get(`OptionLabel:VoiceChat`)}
						component={
							<Boolean
								currentState={settings.voiceChat.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										voiceChat: {
											...settings.voiceChat,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.voiceChat.enabled && (
						<Option
							label={lang.get('OptionLabel:VoiceChatVolume')}
							component={
								<Slider
									currentValue={settings.voiceChat.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											voiceChat: {
												...settings.voiceChat,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}
					<Option
						label={lang.get('OptionLabel:WalkieTalkie')}
						component={
							<Boolean
								currentState={settings.walkieTalkie.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										walkieTalkie: {
											...settings.walkieTalkie,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.walkieTalkie.enabled && (
						<Option
							label={lang.get('OptionLabel:WalkieTalkieVolume')}
							component={
								<Slider
									currentValue={settings.walkieTalkie.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											walkieTalkie: {
												...settings.walkieTalkie,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}
					<Option
						label={lang.get('OptionLabel:BluetoothSpeaker')}
						component={
							<Boolean
								currentState={settings.speakers.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										speakers: {
											...settings.speakers,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.speakers.enabled && (
						<Option
							label={lang.get('OptionLabel:BluetoothSpeakerVolume')}
							component={
								<Slider
									currentValue={settings.speakers.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											speakers: {
												...settings.speakers,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}
					<Option
						label={lang.get('OptionLabel:CarSpeakers')}
						component={
							<Boolean
								currentState={settings.carSpeakers.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										carSpeakers: {
											...settings.carSpeakers,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.carSpeakers.enabled && (
						<Option
							label={lang.get('OptionLabel:CarSpeakersVolume')}
							component={
								<Slider
									currentValue={settings.carSpeakers.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											carSpeakers: {
												...settings.carSpeakers,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}
					<Option
						label={lang.get('OptionLabel:CarSurroundSound')}
						component={
							<Boolean
								currentState={settings.carSurroundSound.enabled}
								labels={{
									true: lang.get('BooleanText:Enabled'),
									false: lang.get('BooleanText:Disabled')
								}}
								onChange={(value: boolean) =>
									updateSettings({
										carSurroundSound: {
											...settings.carSurroundSound,
											enabled: value
										}
									})
								}
							/>
						}
					/>
					{settings.carSurroundSound.enabled && (
						<Option
							label={lang.get('OptionLabel:CarSurroundSoundVolume')}
							component={
								<Slider
									currentValue={settings.carSurroundSound.volume * 100}
									maxNumber={100}
									minNumber={0}
									onChange={(value: number) =>
										updateSettings({
											carSurroundSound: {
												...settings.carSurroundSound,
												volume: value / 100
											}
										})
									}
								/>
							}
						/>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
