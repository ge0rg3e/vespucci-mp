import React from 'react';
import { Typography, Button } from '@mui/material';
import { PhoneState } from '@phone/index';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
import { createAmplitudeEvent } from '@/utils/helpers';
const languageKey = `PHONE_APP_MESSAGES_NOT_FOUND`;
i18n.createLanguagePack(languageKey, LanguagePack);

const ExportingComponent = () => {
	const lang = i18n.getLanguagePack(languageKey, window.language);
	const { setRoute } = PhoneState();

	const goHome = async () => {
		await createAmplitudeEvent(`Selected "Go Home"`);
		setRoute('home');
	};

	return (
		<React.Fragment>
			<Typography variant="body1">Oops.</Typography>
			<Typography variant="body2">{lang.get('Message')}</Typography>
			<Typography variant="caption" style={{ marginTop: 8 }}>
				{lang.get('MissingApp')}: {localStorage['@missingPhoneRoute']}
			</Typography>
			<Button variant="outlined" style={{ marginTop: 16 }} onClick={goHome}>
				{lang.get('GoHome')}
			</Button>
		</React.Fragment>
	);
};

export default ExportingComponent;
