import React from 'react';

// Dependencies
import { copyStringToClipboard, formatPhoneNumber } from '@/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

// Context
import { AppState } from '../../..';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);
	const { contactSelected, shareNumber } = AppState();

	const copyPhoneNumber = () => {
		window.phone.showAlert({
			title: lang.get('Fields:copyPhoneNumber:title'),
			description: lang.get('Fields:copyPhoneNumber:description'),
			buttons: [
				{
					text: 'Ok',
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});

		copyStringToClipboard(formatPhoneNumber(contactSelected.number));
	};

	return (
		<React.Fragment>
			<div className="fields">
				<div className="entry number">
					<div className="label">{lang.get('phone')}</div>
					<div className="value">{formatPhoneNumber(contactSelected.number)}</div>

					<div className="actions">
						<div className="btn" onClick={copyPhoneNumber}>
							<i className="elm fa-solid fa-copy"></i>
						</div>

						<div
							onClick={() =>
								shareNumber(contactSelected.name, contactSelected.number)
							}
							className="btn"
						>
							<i className="elm fa-solid fa-share-nodes"></i>
						</div>
					</div>
				</div>
				<div className="entry notes">
					<div className="label">{lang.get('notes')}</div>
					<div className="value">{contactSelected.notes || ''}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
