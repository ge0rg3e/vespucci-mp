import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';

import { ViewState } from '..';
import { AppState } from '../../..';

const Component = () => {
	const { recipients, setRecipients, lang } = ViewState();
	const { data, getNumberDisplayName, contacts } = AppState();
	const [inputText, setInputText] = useState('');

	const onInputChange = (ev: ExpectedAny) => {
		const value = ev.target.value;
		const regex = /^\d{0,6}$/; // Regular expression to match only numbers with a maximum of 6 digits

		if (regex.test(value)) {
			setInputText(value);
		}
	};

	const addPhoneRecipient = (number: string) => {
		// Max limit
		// if (recipients.length > 30) return false;
		if (recipients.length > 0) return false;

		// Double check
		if (number.length < 6 || number.length > 6) return false;

		// Already added.
		if (recipients.includes(number)) return false;

		// If is us we cannot message ourselves wtf
		if (number === data.phoneNumber) return false;

		setRecipients((currentState: ExpectedAny) => {
			return [...currentState, number];
		});
	};

	const onKeyDown = (ev: ExpectedAny) => {
		if (ev.keyCode === 13) {
			addPhoneRecipient(inputText);
			setInputText('');
		}
	};

	const deleteNumber = (number: string) => {
		setRecipients((currentState: ExpectedAny) =>
			currentState.filter((c: ExpectedAny) => c !== number)
		);
	};

	const showContacts = () => {
		// If they have zero contacts.
		if (contacts.length < 1) {
			return window.phone.showAlert({
				title: lang.get(`recipients:alert.noContacts.heading`),
				description: lang.get('recipients:alert.noContacts.message'),
				buttons: [
					{
						text: 'OK',
						onSelection: ({ dismiss }) => dismiss(),
						color: 'blue'
					}
				]
			});
		}

		window.phone.showActionSheetDropdown({
			title: lang.get('recipients.alert.selectContact.heading'),
			description: lang.get('recipients.alert.selectContact.content'),
			options: contacts
				.sort((a: ExpectedAny, b: ExpectedAny) => a.name.localeCompare(b.name))
				.map((contact: PhoneContact) => ({
					text: `${contact.name}`,
					onSelection: async ({ dismiss }: FixableAny): Promise<void> => {
						// Add
						addPhoneRecipient(contact.number);

						// Close the menu
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
			<div className="component-recipients">
				<div className="input">
					<TextField
						fullWidth={true}
						value={inputText}
						onChange={onInputChange}
						onKeyDown={onKeyDown}
						variant="standard"
						placeholder={lang.get('recipients:placeholder')}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<div className="toLabel">{lang.get('recipients:to')}</div>
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<div className="contacts" onClick={showContacts}>
										<i className="icon fa-solid fa-address-book"></i>
									</div>
								</InputAdornment>
							)
						}}
					/>
				</div>
				<div className="recipients">
					{recipients.map((c: ExpectedAny, ix: number) => (
						<div className={`entry`} key={ix}>
							<div className="component-avatar small">
								<i className="icon fa-solid fa-user"></i>
							</div>
							<div className="text">{getNumberDisplayName(c)}</div>
							<div className="delete-button" onClick={() => deleteNumber(c)}>
								<i className="elm fa-solid fa-circle-minus"></i>
							</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
