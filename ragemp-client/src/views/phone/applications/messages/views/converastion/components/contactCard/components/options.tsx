import { AppState } from '@/views/phone/applications/messages';
import { getLanguagePack } from '@vmp/i18n';
import { ViewState } from '../../..';
import React from 'react';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_CONVERSATION', window.language);
	const { data, deleteConversation, selectedParticipants } = AppState();
	const { setShowContactCard } = ViewState();

	const blockNumber = async () => {
		try {
			// @Todo: To think in the future how to block the numbers if it is a group
			const participant = selectedParticipants.filter(
				(c: ExpectedAny) => c !== data.phoneNumber
			)[0];

			// Ask the server to block it.
			const response = await window.rpc.callServer(
				'phone:contacts.blockNumber',
				JSON.stringify({ phoneNumber: participant })
			);

			// If there are problems..
			if (response === false) throw new Error(`SERVER_ERROR`);

			// Confirmation
			window.phone.showAlert({
				title: lang.get('ContactCard.options:blockNumber:Confirmation.title'),
				description: lang.get('ContactCard.options:blockNumber:Confirmation.description'),
				buttons: [
					{
						text: 'Ok',
						onSelection: ({ dismiss }) => {
							dismiss();
						}
					}
				]
			});
		} catch (err: ExpectedAny) {
			console.info(JSON.stringify(err));
			window.phone.showAlert({
				title: 'Error',
				description: lang.get('ContactCard.options:blockNumber:Confirmation:Error'),
				buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
			});
		}
	};

	const entries = [
		{
			id: 'sendMyLocation',
			disabled: true
		},
		{
			id: 'deleteConversation',
			color: 'red',
			onClick: () => {
				// Hide it
				setShowContactCard(false);

				// Ask to confirm
				window.phone.showAlert({
					title: lang.get('ContactCard.options.deleteConversation.confirmation.title'),
					description: lang.get(
						'ContactCard.options.deleteConversation.confirmation.description'
					),
					buttons: [
						{
							text: lang.get('yes'),
							color: 'red',
							onSelection: ({ dismiss }) => {
								dismiss();

								// Delete this converastion
								deleteConversation(selectedParticipants);
							}
						},
						{
							text: lang.get('no'),
							onSelection: ({ dismiss }) => dismiss(),
							color: 'blue'
						}
					]
				});
			}
		},
		{
			id: 'blockNumber',
			color: 'red',
			onClick: () => {
				window.phone.showAlert({
					title: lang.get('ContactCard.options:blockNumber:Confirmation.title'),
					description: lang.get('ContactCard.options:blockNumber:description'),
					buttons: [
						{
							text: lang.get('yes'),
							color: 'blue',
							onSelection: async ({ dismiss }) => {
								dismiss();
								await blockNumber();
							}
						},
						{
							text: lang.get('no'),
							onSelection: ({ dismiss }) => dismiss(),
							color: 'red'
						}
					]
				});
			}
		}
	];

	return (
		<React.Fragment>
			<div className="options">
				<div className="content">
					{entries.map((c: ExpectedAny, ix) => (
						<div
							key={ix}
							className={`entry ${c.disabled && 'disabled'} ${
								c.color === 'red' && 'red'
							}`}
							onClick={c.onClick}
						>
							<div className="label">{lang.get(`ContactCard.options.${c.id}`)}</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
