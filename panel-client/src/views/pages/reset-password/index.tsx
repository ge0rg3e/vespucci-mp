import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Dependencies
import { createComponentLanguage, getAlerts, getComponentLanguage, getValidationPropFields, logError, makeEndpointRequest, validateAgainstSchema } from '@/utils/helpers';
import { confirmResetSchema, requsetResetSchema } from './validation';
import { createAmplitudeEvent } from '@/utils/amplitude';

// Components
import Container from '@/views/layout/core/container';
import { Button, TextField } from '@mui/material';
import AlertsListener from '@components/alerts';

// Language
import Language from './language';
const LanguagePackId = createComponentLanguage('reset-password', Language);

const Component = () => {
	// Dependencies..
	const router = useRouter();
	const lang = getComponentLanguage(LanguagePackId);
	const alerts = getAlerts('reset_password');
	const token = router.query.token?.toString();

	// Variables..
	const [validationResults, setValidationResults] = useState({});
	const [forms, setForms] = useState({
		newPassword: '',
		credential: '',
		token
	});

	const onSubmit = async () => {
		alerts.reset();

		try {
			// Make the API request to change..
			await makeEndpointRequest('auth/reset-password', !token ? 'POST' : 'PATCH', {}, forms);

			// The email has been sent.
			if (!token) {
				alerts.set('success', lang.get('alert:sended'), 10);
				createAmplitudeEvent(`Sent email confirmation code`, { credential: forms.credential });
				return false;
			}

			alerts.set('success', lang.get('alert:changed'));
			setTimeout(() => router.push('/authentication'), 1000);
			createAmplitudeEvent(`Password reset`);
		} catch (err: ExpectedAny) {
			// No email or username matching
			if (err.response && err.response.status === 404) return alerts.set('error', lang.get('alert:credentialNotFound'));
			createAmplitudeEvent(`Having Difficulties`, { reason: err.message });
			await logError('RESET_PASSWORD', err, { credential: forms.credential });
			alerts.set('error', lang.get('alert:havingDifficultiesMessage'));
		}
	};

	const validateFields = async () => {
		try {
			await validateAgainstSchema(!token ? requsetResetSchema : confirmResetSchema, forms);
			setValidationResults({});
		} catch (err: ExpectedAny) {
			setValidationResults(err);
		}
	};

	const onUpdateForms = (name: string, value: string | boolean) => setForms((o) => ({ ...o, [name]: value }));

	useEffect(() => {
		validateFields();
		// eslint-disable-next-line
	}, [forms]);

	const onAlertsMounted = (alerts: ExpectedAny) => {
		if (router.query.invalid) {
			alerts.set('error', lang.get('alert:invalidToken'));
		}
	};

	useEffect(() => {
		createAmplitudeEvent(`Reset Password`);
	}, []);

	return (
		<Container title="Reset password" classNames="page-authentication reset-password" withoutLayout>
			<div className="box">
				<div className="left">
					<div className="character">
						<img src={`/assets/images/pages/authentication/character.png`} className={`img`} alt="Character" />
					</div>
				</div>

				<div className="right">
					<div className="heading">{lang.get('heading')}</div>

					<AlertsListener id="reset_password" onMount={onAlertsMounted} />

					{!token ? (
						<div className="form-group">
							<div className="form-label">{lang.get('usernameOrEmail')}</div>
							<div className="form-component">
								<TextField
									{...getValidationPropFields(validationResults, forms.credential.length > 0, 'credential')}
									onChange={(e) => onUpdateForms('credential', e.target.value)}
									value={forms.credential}
									variant="outlined"
									type={'text'}
									placeholder="email@domain.com"
									fullWidth
								/>
							</div>
						</div>
					) : (
						<div className="form-group">
							<div className="form-label">{lang.get('newPassword')}</div>
							<div className="form-component">
								<TextField
									{...getValidationPropFields(validationResults, forms.newPassword.length > 0, 'newPassword')}
									onChange={(e) => onUpdateForms('newPassword', e.target.value)}
									value={forms.newPassword}
									variant="outlined"
									type={'password'}
									placeholder={lang.get('password')}
									fullWidth
								/>
							</div>
						</div>
					)}

					<div className="buttons">
						<Button type="submit" variant="contained" fullWidth className="submit" onClick={onSubmit} disabled={Object.keys(validationResults).length > 0}>
							{lang.get('submit')}
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Component;
