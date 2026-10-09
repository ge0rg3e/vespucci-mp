import { createComponentLanguage, getAlerts, getComponentLanguage, getValidationPropFields, logError, makeEndpointRequest, validateAgainstSchema } from '@/utils/helpers';
import React, { useState, useEffect } from 'react';
import { changePasswordSchema } from '../validation';

// Components
import AlertsListener from '@components/alerts';
import { TextField, Button } from '@mui/material';

// Context
import { PageState } from '..';

// Create the language pack..
import ComponentLanguages from './password.language';
const TranslationPack = createComponentLanguage('settings.password', ComponentLanguages);

const Component = () => {
	const { submitted, draftData, updateDraftData, setSubmitted } = PageState();
	const [validationResults, setValidationResults] = useState({});
	const lang = getComponentLanguage(TranslationPack);
	const alerts = getAlerts('settings.password');

	const onSubmit = async () => {
		alerts.reset();

		try {
			await makeEndpointRequest(
				'settings/change-password',
				'POST',
				{},
				{
					password: draftData.currentPassword,
					newPassword: draftData.newPassword
				}
			);

			// Show success informatio
			alerts.set('success', lang.get('alert:successfully'), 30);

			setSubmitted(false);
		} catch (err: ExpectedAny) {
			setSubmitted(false);

			// If current password is invalid.
			if (err.response && err.response.status === 404) return alerts.set('error', lang.get('alert:invalidCredential'));

			// If IP address is different
			if (err.response && err.response.status === 403) return alerts.set('error', lang.get('alert:InvalidIP'));

			await logError('CHANGE_PASSWORD', err);

			alerts.set('error', lang.get('alert:havingDifficultiesMessage'));
		}
	};

	const validateFields = async () => {
		try {
			await validateAgainstSchema(changePasswordSchema, draftData);
			setValidationResults({});
		} catch (err: ExpectedAny) {
			setValidationResults(err);
		}
	};

	useEffect(() => {
		validateFields();
		// eslint-disable-next-line
	}, [draftData]);

	return (
		<React.Fragment>
			<div className="card">
				<div className="content">
					<div className="heading">{lang.get('heading')}</div>
					<div className="description mb">{lang.get('description')}</div>

					<AlertsListener id="settings.password" />

					<div className="form-group">
						<div className="form-label">{lang.get('currentPassword')}</div>
						<div className="form-component">
							<TextField
								{...getValidationPropFields(validationResults, draftData.currentPassword.length > 0, 'currentPassword')}
								onChange={(ev) => updateDraftData('currentPassword', ev.target.value)}
								placeholder={lang.get('currentPassword:placeholder')}
								value={draftData.currentPassword}
								disabled={submitted}
								variant="outlined"
								fullWidth={true}
								type="password"
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="form-label">{lang.get('newPassword')}</div>
						<div className="form-component">
							<TextField
								{...getValidationPropFields(validationResults, draftData.newPassword.length > 0, 'newPassword')}
								onChange={(ev) => updateDraftData('newPassword', ev.target.value)}
								placeholder={lang.get('newPassword:placeholder')}
								value={draftData.newPassword}
								disabled={submitted}
								variant="outlined"
								fullWidth={true}
								type="password"
							/>
						</div>
					</div>

					<Button variant="contained" color="primary" className="submit-btn" disabled={submitted || Object.keys(validationResults).length > 0} onClick={onSubmit}>
						{lang.get('submit')}
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
