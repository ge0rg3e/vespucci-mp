import React from 'react';

// Dependencies
import { copyStringToClipboard, formatPhoneNumber } from '@/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';
import { AppState } from '../../..';
import { AppContext } from '@/utils/context';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CONTACTDETAILS', window.language);

	const { data, shareNumber } = AppState();
	const { account } = AppContext();

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

		copyStringToClipboard(formatPhoneNumber(data.localInfo.number));
	};

	return (
		<React.Fragment>
			<div className="fields">
				<div className="entry number">
					<div className="label">{lang.get('phone')}</div>
					<div className="value">{formatPhoneNumber(data.localInfo.number)}</div>

					<div className="actions">
						<div className="btn" onClick={copyPhoneNumber}>
							<i className="elm fa-solid fa-copy"></i>
						</div>

						<div
							onClick={() => shareNumber(account.username, data.localInfo.number)}
							className="btn"
						>
							<i className="elm fa-solid fa-share-nodes"></i>
						</div>
					</div>
				</div>

				<div className="entry">
					<div className="label">{lang.get('phone-credit')}</div>
					<div className="value">{data.localInfo.credits}</div>
				</div>

				<div className="entry notes">
					<div className="label">{lang.get('notes')}</div>
					<div className="value">{lang.get('notes:contactCard')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
