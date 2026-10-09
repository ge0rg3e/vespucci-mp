import { AppState } from '../..';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import List from './components/list';

// Language translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './index.language';

const languagePackId = `PHONE_APP_BETA_TESTING_MENU`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const { data, triggerToolkitEvent } = AppState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const onResetValue = (id: string) => {
		triggerToolkitEvent('Reset', { valueName: id });
	};

	const onSetValue = (id: string) => {
		window.phone.showKeyboard({
			inputData: {
				defaultValue: data.currentValues[id],
				instructions: lang.get('InstructionsSet'),
				placeholder: lang.get('Placeholder:Number'),
				type: 'number'
			},
			onSubmit: (value, { dismiss }) => {
				triggerToolkitEvent('Set', {
					valueName: id,
					value: parseInt(value)
				});
				dismiss();
			},
			validationFunc: (value) => {
				if (value < 0) return lang.get('Set:ValueBelowTheLimit');

				// Checking if max number..
				let MAX_NUMBER = 999999999;

				if (['health', 'armour'].includes(id)) {
					MAX_NUMBER = 100;
				}

				if (value > MAX_NUMBER) return lang.get('Set:ValueOverTheLimit');

				return true;
			},
			validationOptions: {
				isEmpty: false
			}
		});
	};

	const onItemSelected = (entry: FixableAny) => {
		if (entry.payload.type === 'set') {
			window.phone.showActionSheet({
				title: lang.get('Title:ChooseValue'),
				description: lang.get('Description:Set'),
				options: [
					...['health', 'armour', 'experience', 'money', 'level'].map((entry) => ({
						text: lang.get(`Set:${entry}`),
						onSelection: ({ dismiss }: FixableAny) => {
							onSetValue(entry);
							dismiss();
						}
					}))
				],
				cancel: {
					text: lang.get('Cancel'),
					onCancel: ({ dismiss }) => dismiss()
				}
			});
			return true;
		}

		if (entry.payload.type === 'reset') {
			window.phone.showActionSheet({
				title: lang.get('Title:ChooseValue'),
				description: lang.get('Description:Reset'),
				options: [
					...['inventory'].map((entry: string) => ({
						text: lang.get(`Reset:${entry}`),
						onSelection: ({ dismiss }: ExpectedAny) => {
							onResetValue(entry);
							dismiss();
						}
					}))
				],
				cancel: {
					text: lang.get('Cancel'),
					onCancel: ({ dismiss }) => dismiss()
				}
			});
			return true;
		}

		if (entry.payload.type === 'toggleGhostMode') {
			triggerToolkitEvent('Ghostmode', { bool: !data.currentValues.ghostMode });
			return true;
		}

		if (entry.payload.type === 'teleport') {
			window.phone.showActionSheetDropdown({
				title: lang.get('ActionSheetTitle:Teleport'),
				subtitle: lang.get('ActionSheetDescription:Teleport'),
				options: data.teleports.map((tpName: string) => ({
					text: tpName,
					onSelection: ({ dismiss }: ExpectedAny) => {
						triggerToolkitEvent('Teleport', { selected: tpName });
						dismiss();
					}
				})),
				cancel: {
					text: lang.get('Cancel'),
					onCancel: ({ dismiss }) => dismiss()
				}
			});
			return true;
		}
	};

	return (
		<div className="screen menu">
			<NavigationHeader theme="light" title={lang.get('ScreenTitle')} />
			<List lang={lang} onItemSelected={onItemSelected} />
		</div>
	);
};

export default Component;
