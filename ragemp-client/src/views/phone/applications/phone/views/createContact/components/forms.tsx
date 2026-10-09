import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { ViewState } from '..';
import { formatPhoneNumber } from '@/utils/helpers';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CREATECONTACT', window.language);
	const { data, setData } = ViewState();

	const onNameChange = (ev: ExpectedAny) => {
		ev.preventDefault();

		// Remove emojis from the input value
		const cleanedValue = ev.target.value.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');

		// Count characters without emojis
		const characterCount = cleanedValue.length;

		// We don't allow longer names than 24 characters.
		if (characterCount > 24) return false;

		setData({
			...data,
			name: cleanedValue || ''
		});
	};

	const onPhoneChange = (ev: ExpectedAny) => {
		ev.preventDefault();

		// Remove non-digit characters from the new text
		const newNumber = ev.target.value.replace(/\D/g, '');

		// When numbers get too long.
		if (newNumber.length > 6) return false; // number too long.

		setData({
			...data,
			number: newNumber
		});
	};

	return (
		<React.Fragment>
			<div className="forms">
				<div className="entry">
					<input
						placeholder={lang.get('Forms:placeholder:name')}
						onChange={onNameChange}
						value={data.name}
						type="text"
					/>
				</div>
				<div className="entry">
					<input
						placeholder={lang.get('Forms:placeholder:phoneNumber')}
						type="text"
						value={
							data.number.length > 0
								? data.number.length > 3 // we format phone numbers only after 6 chars.
									? formatPhoneNumber(data.number)
									: data.number
								: '' // if is empty we show placeholder
						}
						onChange={onPhoneChange}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
