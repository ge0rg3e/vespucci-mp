import { fakeRPCEventResponse, truncateString } from '@/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { useEffect, useState } from 'react';
import SimulatedResponse from '../response';

// Component
import SubMenus from '../../../components/subMenus';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_SETTINGS_SOUNDS', window.language);
	const [data, setData] = useState<ExpectedAny>(null);

	const onChnageRingTone = () => {
		window.phone.showActionSheetDropdown({
			title: lang.get('Ringtone'),
			description: lang.get('Ringtone.onChange'),
			options: data.ringtones.map(({ id, name }: ExpectedAny) => ({
				text: name,
				color: 'blue',
				onSelection: async ({ dismiss }: FixableAny): Promise<void> => {
					try {
						// Call the server to change the selected ringtone.
						const res = await window.rpc.callServer(
							'phone:settings.ringtone.change',
							JSON.stringify({ id })
						);

						// If the server response is false, throw an error.
						if (res === false) throw new Error('SERVER_ERROR');

						// Update the current ringtone in the UI.
						setData({ ...data, current: id });

						// Dismiss the dropdown action sheet.
						dismiss();

						// Show an alert confirming the ringtone update.
						window.phone.showAlert({
							title: lang.get('Ringtone'),
							description: lang.get('Ringtone.onChange.confirmation'),
							buttons: [
								{
									onSelection: ({ dismiss }) => dismiss(),
									text: 'OK'
								}
							]
						});
					} catch (err) {
						window.phone.showAlert({
							title: lang.get('Ring'),
							description: lang.get('Ringtone.onChange.SERVER_ERROR'),
							buttons: [
								{
									onSelection: ({ dismiss }) => dismiss(),
									text: 'OK'
								}
							]
						});
					}
				}
			})),
			cancel: {
				onCancel: ({ dismiss }) => dismiss(),
				text: lang.get('Cancel')
			}
		});
	};

	const onReceivedData = (args: string) => {
		setData(JSON.parse(args));
	};

	const getRingtoneName = () => {
		if (!data) return 'Default';
		const find = data.ringtones.find((entry: ExpectedAny) => entry.id === data.current);
		return find.name ? truncateString(find.name, 15) : 'Default';
	};

	useEffect(() => {
		window.rpc.triggerServer('phone:settings.ringtone.requestData');

		if (window.mp.fake) {
			// Set simulated data
			setData(SimulatedResponse);
		}

		window.rpc.on(`phone:settings.ringtone.receivedData`, onReceivedData);

		return () => {
			window.socket.off(`phone:settings.ringtone.receivedData`);
		};
	}, []);

	return (
		<section className="ring-tone">
			<div className="header">
				<div className="label">{lang.get('Ringtone.header')}</div>
			</div>

			<SubMenus
				onClick={() => {
					onChnageRingTone();
				}}
				item={{
					label: lang.get('Ringtone'),
					right: getRingtoneName(),
					color: '#ff315b',
					id: 'ringtone',
					type: 'select'
				}}
			/>
		</section>
	);
};

export default Component;
