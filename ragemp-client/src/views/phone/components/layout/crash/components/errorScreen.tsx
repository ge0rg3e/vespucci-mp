import React from 'react';

// Context
import { PhoneState } from '@/views/phone';

// Language

import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.layout.crash.errorScreen`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = (props: ExpectedAny) => {
	const { setRoute } = PhoneState();

	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const restartPhone = () => {
		// Clear the error from the boundary
		props.clearError();

		// Set route
		setRoute('lockscreen', {});
	};

	return (
		<React.Fragment>
			<div className="screen-content">
				<div className="device-component-crash-screen">
					<div className="--content">
						<div className="heading">{lang.get('Heading')}</div>
						<div className="message">{lang.get('Message')}</div>
						<div className="app-component-button blue" onClick={restartPhone}>
							{lang.get('Button')}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
