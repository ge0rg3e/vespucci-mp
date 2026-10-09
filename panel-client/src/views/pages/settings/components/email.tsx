import React, { useState, useEffect, Fragment } from 'react';

// Components
import AlertsListener from '@components/alerts';
import { TextField, Button } from '@mui/material';

// Context
import { PageState } from '..';

// Dependencies
import { getAlerts, createComponentLanguage, getComponentLanguage, getValidationPropFields, logError, makeEndpointRequest, validateAgainstSchema } from '@/utils/helpers';
import { changeEmailSchema, requestChangeEmailSchema } from '../validation';

// Create the language pack..
import ComponentLanguages from './email.language';
const TranslationPack = createComponentLanguage('settings.email', ComponentLanguages);

const Component = () => {
	const { data, draftData, updateDraftData, submitted, setSubmitted } = PageState();
	const [validationResults, setValidationResults] = useState({});
	const [step, setStep] = useState<0 | 1>(0);
	const alerts = getAlerts('settings.email');
	const lang = getComponentLanguage(TranslationPack);

	const onSubmit = async () => {
		alerts.reset();
		setSubmitted(true);

		try {
			// Send the email codes
			if (step === 0) {
				// Send the codes..
				await makeEndpointRequest(
					'settings/change-email',
					'POST',
					{},
					{
						newEmail: draftData.email
					}
				);

				// Dispatch the alert..
				alerts.set('success', lang.get('alert:sent'), 30);
				setSubmitted(false);
				setStep(1);
				return false;
			}

			// Confirm the email change
			if (step === 1) {
				await makeEndpointRequest(
					'settings/confirm-change-email',
					'POST',
					{},
					{
						codeOldEmail: draftData.codeOldEmail,
						codeNewEmail: draftData.codeNewEmail,
						newEmail: draftData.email
					}
				);

				// Dispatch the alert..
				alerts.set('success', lang.get('alert:successfully'), 30);

				setSubmitted(false);
				setStep(0);

				return false;
			}
		} catch (err: ExpectedAny) {
			setSubmitted(false);

			// If the email is already used..
			if (step === 0 && err.response && err.response.status === 302) return alerts.set('error', lang.get('alert:emailUsed'));

			// If the codes are invalid
			if (step === 1 && err.response && err.response.status === 404) return alerts.set('error', lang.get('alert:invalidCodes'));

			// If IP address is different
			if (err.response && err.response.status === 403) return alerts.set('error', lang.get('alert:InvalidIP'));

			// Log the error if anything else..
			await logError('CHANGE_EMAIL', err);

			// Dispatch the error..
			alerts.set('error', lang.get('alert:havingDifficultiesMessage'));
		}
	};

	const validateFields = async () => {
		try {
			await validateAgainstSchema(step === 0 ? requestChangeEmailSchema : changeEmailSchema, {
				codeOldEmail: draftData.codeOldEmail,
				codeNewEmail: draftData.codeNewEmail,
				newEmail: draftData.email
			});
			setValidationResults({});
		} catch (err: ExpectedAny) {
			console.error(err);
			setValidationResults(err);
		}
	};

	useEffect(() => {
		validateFields();
		// eslint-disable-next-line
	}, [draftData, step]);

	return (
		<React.Fragment>
			<div className="card">
				<div className="content">
					<div className="heading">{lang.get('heading')}</div>
					<div className="description mb">{lang.get('description')}</div>

					<AlertsListener id="settings.email" />

					<div className="form-group">
						<div className="form-label">Email</div>
						<div className="form-component">
							<TextField
								{...getValidationPropFields(validationResults, draftData.email.length > 0, 'email')}
								onChange={(ev) => updateDraftData('email', ev.target.value)}
								value={draftData.email}
								disabled={submitted}
								variant="outlined"
								fullWidth={true}
							/>
						</div>
					</div>

					{step === 1 && (
						<Fragment>
							<div className="form-group">
								<div className="form-label">
									{lang.get('code')} - {lang.get('oldEmail')}
								</div>
								<div className="form-component">
									<TextField
										{...getValidationPropFields(validationResults, draftData.codeOldEmail.length > 0, 'codeOldEmail')}
										onChange={(ev) => updateDraftData('codeOldEmail', ev.target.value)}
										placeholder={lang.get('code')}
										value={draftData.codeOldEmail}
										disabled={submitted}
										variant="outlined"
										fullWidth={true}
									/>
								</div>
							</div>

							<div className="form-group">
								<div className="form-label">
									{lang.get('code')} - {lang.get('newEmail')}
								</div>
								<div className="form-component">
									<TextField
										{...getValidationPropFields(validationResults, draftData.codeNewEmail.length > 0, 'codeNewEmail')}
										onChange={(ev) => updateDraftData('codeNewEmail', ev.target.value)}
										value={draftData.codeNewEmail}
										placeholder={lang.get('code')}
										disabled={submitted}
										variant="outlined"
										fullWidth={true}
									/>
								</div>
							</div>
						</Fragment>
					)}

					<Button
						disabled={submitted || Object.keys(validationResults).length > 0 || draftData.email === data.email}
						className="submit-btn"
						variant="contained"
						onClick={onSubmit}
						color="primary"
					>
						{lang.get('submit')}
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
