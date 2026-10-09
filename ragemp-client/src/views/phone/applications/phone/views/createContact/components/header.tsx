import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { ViewState } from '..';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_CREATECONTACT', window.language);
	const { onSubmit, onCancel, submitted, validForm } = ViewState();

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className={`entry ${submitted && 'disabled'}`} onClick={onCancel}>
						<div className="label">{lang.get('Header:left-side:label')}</div>
					</div>
				</div>
				<div className="middle">
					<div className="label">{lang.get('Header:middle:label')}</div>
				</div>
				<div className="right-side">
					<div
						className={`entry ${submitted || (!validForm && 'disabled')}`}
						onClick={onSubmit}
					>
						<div className="label">{lang.get('Header:right-side:label')}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
