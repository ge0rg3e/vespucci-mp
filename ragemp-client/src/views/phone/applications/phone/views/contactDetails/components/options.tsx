import { fakeAwait } from '@/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { PhoneState } from '@/views/phone';
import { AppState } from '../../..';
import React from 'react';

const Component = () => {
	const {
		refreshContactsList,
		deleteContactId,
		contactSelected,
		setSubRoute,
		data,
		blockedNumbers,
		updateBlockedNumbers
	} = AppState();
	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);

	const { closeApplication, openApplication } = PhoneState();

	const isBlocked = blockedNumbers.find(
		({ number }: ExpectedAny) => number === contactSelected.number
	);

	const blockNumber = async () => {
		try {
			// Ask the server to block it.
			const response = await window.rpc.callServer(
				'phone:contacts.blockNumber',
				JSON.stringify({ phoneNumber: contactSelected.number })
			);

			// If there are problems..
			if (response === false) throw new Error(`SERVER_ERROR`);

			// Confirmation
			window.phone.showAlert({
				title: lang.get('Options:blockNumber:Confirmation.title'),
				description: lang.get('Options:blockNumber:Confirmation.description'),
				buttons: [
					{
						text: 'Ok',
						onSelection: ({ dismiss }) => {
							dismiss();
						}
					}
				]
			});

			// Mark it visually here as blocked.
			updateBlockedNumbers('add', contactSelected.number);
		} catch (err: ExpectedAny) {
			console.info(JSON.stringify(err));
			window.phone.showAlert({
				title: 'Error',
				description: lang.get('Error.reponse'),
				buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
			});
		}
	};

	const unblockNumber = async () => {
		try {
			// Ask the server to unblock it..
			const response = await window.rpc.callServer(
				'phone:contacts.unblockNumber',
				JSON.stringify({ phoneNumber: contactSelected.number })
			);

			// If there are problems..
			if (response === false) throw new Error(`SERVER_ERROR`);

			// Confirmation.
			window.phone.showAlert({
				title: lang.get('Options:unblockNumber:Confirmation.title'),
				description: lang.get('Options:unblockNumber:Confirmation.description'),
				buttons: [
					{
						text: 'Ok',
						onSelection: ({ dismiss }) => {
							dismiss();
						}
					}
				]
			});

			// Mark it visually here as unblocked.
			updateBlockedNumbers('remove', contactSelected.number);
		} catch (err: ExpectedAny) {
			window.phone.showAlert({
				title: 'Error',
				description: lang.get('Error.reponse'),
				buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
			});
		}
	};

	const onEdit = () => {
		// Set the view (id is already set)
		setSubRoute('editContact');
	};

	const deleteContact = async () => {
		try {
			const response = await window.rpc.callServer(
				`phone:contacts.delete`,
				JSON.stringify({ id: contactSelected.id })
			);

			// If we found out he wasn't in his contacts (cache issue)
			if (response === 'NOT_IN_CONTACTS') throw new Error(`NOT_IN_CONTACTS`);

			// If server difficulties
			if (response === false) throw new Error(`SERVER_ERROR`);

			// All good. now let's delete it for front-end.
			deleteContactId(contactSelected.id);

			// Show success message
			window.phone.showAlert({
				title: lang.get('Options:deleteContact:Alert:title'),
				description: lang.get('Options:deleteContact:Alert:description'),
				buttons: [
					{
						text: `OK`,
						onSelection: ({ dismiss }) => dismiss()
					}
				]
			});
		} catch (err: ExpectedAny) {
			if (err.meessage === 'NOT_IN_CONTACTS') refreshContactsList();

			window.phone.showAlert({
				title: lang.get('Options:deleteContact:Alert:Error:title'),
				description: lang.get(
					`Options:deleteContact:Alert:Error:description${
						err.meessage === 'NOT_IN_CONTACTS' ? ':notInContact' : ''
					}`
				),
				buttons: [
					{
						text: `OK`,
						onSelection: ({ dismiss }) => dismiss()
					}
				]
			});
		}
	};

	const entries = [
		{
			id: 'message',
			onClick: async () => {
				// Close the message application
				closeApplication();

				// Wait for 500 ms for a smooth transition?
				await fakeAwait(500);

				// @Why do I do this? Because events are not accessible.

				// Open the messages app
				openApplication({
					route: 'messages',
					payload: {
						subRoute: 'list',
						gotoConverastion: {
							participants: [contactSelected.number, data.localInfo.number]
						}
					}
				});
			}
		},
		{
			id: 'editContact',
			onClick: onEdit
		},
		{
			id: 'deleteContact',
			onClick: () => {
				// Show alert..
				window.phone.showAlert({
					title: lang.get('confirmation'),
					description: lang.get('Options:entries:deleteContact:Alert:description'),
					buttons: [
						{
							text: lang.get('yes'),
							color: 'red',
							onSelection: ({ dismiss }) => {
								deleteContact();
								dismiss();
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
			id: isBlocked ? 'unblockNumber' : 'blockNumber',
			onClick: async () => {
				if (isBlocked) {
					await unblockNumber();
				} else {
					window.phone.showAlert({
						title: lang.get('confirmation'),
						description: lang.get('Options:blockNumber:description'),
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
		}
	];

	return (
		<React.Fragment>
			<div className="options">
				<div className="content">
					{entries.map((c: ExpectedAny, ix) => (
						<div
							key={ix}
							className={`entry ${
								['blockNumber', 'unblockNumber'].includes(c.id) && 'red'
							}`}
							onClick={c.onClick}
						>
							<div className="label">{lang.get(`Options:entries:${c.id}`)}</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
