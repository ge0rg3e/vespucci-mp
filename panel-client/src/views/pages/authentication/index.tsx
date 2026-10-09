import { useEffect, useState } from 'react';

// Dependencies
import { createComponentLanguage, getAlerts, getComponentLanguage, getValidationPropFields, logError, makeEndpointRequest, validateAgainstSchema } from '@/utils/helpers';
import { AppContext } from '@/utils/context';
import { loginSchema } from './validation';
import { useRouter } from 'next/router';
import { createAmplitudeEvent } from '@/utils/amplitude';

// Components
import { Button, Checkbox, TextField } from '@mui/material';
import Container from '@/views/layout/core/container';
import AlertsListener from '@components/alerts';

// Language
import Language from './language';
const LanguagePackId = createComponentLanguage('authentication', Language);

const Component = () => {
	const router = useRouter();

	const { setAccount } = AppContext();
	const [showBackButton, setShowBackButton] = useState<boolean>(false);
	const [validationResults, setValidationResults] = useState({});
	const [forms, setForms] = useState({
		rememberMe: false,
		username: '',
		password: ''
	});

	const lang = getComponentLanguage(LanguagePackId);
	const alerts = getAlerts('auth.main');

	// Callbacks
	const onSubmit = async () => {
		alerts.reset();

		try {
			const data = await makeEndpointRequest('auth/login', 'POST', {}, forms);

			// Set account data..
			await setAccount(data);

			const redirect = localStorage.getItem('@redirectAfterAuthTo');
			router.push(redirect ? redirect : '/');
		} catch (err: ExpectedAny) {
			if (err.response && err.response.status === 404) return alerts.set('error', lang.get('invalidCredentials'));

			await logError('LOGIN', err, {
				username: forms.username
			});

			alerts.set('error', lang.get('havingDifficultiesMessage'));

			createAmplitudeEvent(`Having Difficulties`, { reason: err.message });
		}
	};

	const validateFields = async () => {
		try {
			await validateAgainstSchema(loginSchema, forms);
			setValidationResults({});
		} catch (err: ExpectedAny) {
			setValidationResults(err);
		}
	};

	const goToHome = () => {
		router.push('/');
	};

	const forgotPassword = async () => {
		router.push('/reset-password');
	};

	const onUpdateForms = (name: string, value: string | boolean) => setForms((o) => ({ ...o, [name]: value }));

	useEffect(() => {
		validateFields();
		// eslint-disable-next-line
	}, [forms]);

	const onAlertsMounted = (alerts: ExpectedAny) => {
		if (router.query.required) {
			alerts.set('error', lang.get('noAccess'));
		}
	};

	useEffect(() => {
		createAmplitudeEvent('Authentication');

		if (router.query.callback_url) {
			localStorage.setItem('@redirectAfterAuthTo', router.query.callback_url.toString());
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const onRouteChange = () => {
			setShowBackButton(router.asPath !== '/');
		};

		router.events.on('routeChangeComplete', onRouteChange);

		return () => router.events.off('routeChangeComplete', onRouteChange);
	}, [router]);

	return (
		<Container title="Authentication" classNames="page-authentication login" withoutLayout>
			<div className="box">
				<div className="left">
					{showBackButton && (
						<Button className="backToHome" variant="text" onClick={goToHome}>
							<i className="fas fa-long-arrow-left"></i> {lang.get('goBack')}
						</Button>
					)}

					<div className="character">
						<img src={`/assets/images/pages/authentication/character.png`} className={`img`} alt="Character" />
					</div>
				</div>

				<div className="right">
					<div className="heading">{lang.get('heading')}</div>

					<AlertsListener id="auth.main" onMount={onAlertsMounted} />

					<div className="form-group">
						<div className="form-label">{lang.get('username')}</div>
						<div className="form-component">
							<TextField
								{...getValidationPropFields(validationResults, forms.username.length > 0, 'username')}
								onChange={(e) => onUpdateForms('username', e.target.value)}
								placeholder={lang.get('username')}
								value={forms.username}
								variant="outlined"
								type={'text'}
								fullWidth
							/>
						</div>
					</div>

					<div className="form-group">
						<div className="form-label">{lang.get('password')}</div>
						<div className="form-component">
							<TextField
								{...getValidationPropFields(validationResults, forms.password.length > 0, 'password')}
								onChange={(e) => onUpdateForms('password', e.target.value)}
								placeholder={lang.get('password')}
								value={forms.password}
								variant="outlined"
								type={'password'}
								fullWidth
							/>
						</div>
					</div>

					<div className="form-group remember-me">
						<div className="form-component">
							<div className="checkbox">
								<Checkbox onChange={(_, v) => onUpdateForms('rememberMe', v)} value={forms.rememberMe} />
								<div className="label">{lang.get('rememberMe')}</div>
							</div>
							<a className="forgot-password" onClick={forgotPassword}>
								{lang.get('forgotPassword')}
							</a>
						</div>
					</div>

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
