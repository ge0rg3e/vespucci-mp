import { ComponentState } from '../../../../../../';
import { AppContext } from '@/utils/context';
import quickMessages from './quickMessages';
import { getLanguagePack } from '@vmp/i18n';
import React, { useState } from 'react';

const Component = () => {
	const lang = getLanguagePack('PHONE_LAYOUT_PHONECALL', window.language);
	const [callAccepted, setCallAccepted] = useState(false);
	const { respondCall } = ComponentState();
	const { phoneCall } = AppContext();

	const acceptCall = () => {
		setCallAccepted(true);

		// Inform the server after 1 second for the animation to happen
		setTimeout(() => respondCall(true), 1000);
	};

	const sendQuickMessage = () => {
		window.phone.showActionSheetDropdown({
			title: lang.get('QuickMessage.title'),
			description: lang.get('QuickMessage.description'),
			options: quickMessages.map((msg) => ({
				text: msg[window.language],
				onSelection: ({ dismiss }) => {
					// Trigger server event to send message
					window.rpc.triggerServer(
						`phoneCall.sendQuickMessage`,
						JSON.stringify({ lineId: phoneCall.id, msg })
					);

					// Reject the call
					respondCall(false);

					dismiss();
				}
			})),
			cancel: {
				text: 'Cancel',
				onCancel: ({ dismiss }: FixableAny): void => dismiss()
			}
		});
	};

	return (
		<React.Fragment>
			<div className="component-footer">
				<div className="additional-responses">
					<div className="entry" onClick={() => respondCall(false)}>
						<div className="icon">
							<i className="elm fas fa-times"></i>
						</div>
						<div className="text">{lang.get('Respond.reject')}</div>
					</div>

					<div className="entry" onClick={sendQuickMessage}>
						<div className="icon">
							<i className="elm fas fa-message"></i>
						</div>
						<div className="text">{lang.get('Respond.message')}</div>
					</div>
				</div>
				<div className={`respondCall ${callAccepted && 'accepted'}`} onClick={acceptCall}>
					<div className={`btn`}>
						<i className="icon fas fa-phone"></i>
					</div>
					<div className="text">{lang.get('Respond.Call', { callAccepted })}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
