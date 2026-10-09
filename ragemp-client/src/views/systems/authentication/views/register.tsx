import React, { useEffect, useState } from 'react';
import { Input, Button, Select, MenuItem } from '@mui/material';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import { type Languages } from '@vmp/i18n';
import RegisterLanguage from './register.language';

i18n.createLanguagePack('SYSTEM_REGISTER', RegisterLanguage);

// Components
import ButtonLoader from '../components/buttonLoader';
import { interpetingRPCEvent, logError, createAmplitudeEvent, isEmoji } from '@/utils/helpers';
import { AppContext } from '@/utils/context';
import { useNavigate } from 'react-router-dom';
import { getCapsLockProps } from './login';

interface RegisterProps {
	setView: (view: string) => void;
}

const Register = ({ setView }: RegisterProps) => {
	const { setAccount }: ExpectedAny = AppContext();
	const [submitted, setSubmitted] = useState(false);
	const lang = i18n.getLanguagePack('SYSTEM_REGISTER', window.language);
	const [capsLockEnabled, setCapsLockEnabled] = useState(false);
	const [inputFocusedId, setInputFocusedId] = useState<string | null>(null);

	const navigate = useNavigate();

	const [data, setData] = useState({
		username: '',
		password: '',
		email: '',
		language: window.language || 'EN'
	});

	const onKeyCapsListener = (event: UndefinedAny) => {
		setCapsLockEnabled(event.getModifierState('CapsLock') ? true : false);
	};

	useEffect(() => {
		window.addEventListener('keyup', onKeyCapsListener);
		return () => {
			window.removeEventListener('keyup', onKeyCapsListener);
			window.clearToasts();
		};
	}, []);

	const submit = async () => {
		try {
			if (window.mp.fake) {
				return window.toast({
					type: 'error',
					message: lang.get(`ErrorRageEnvironmentOnly`)
				});
			}

			const fillMandatoryFields = [data.username, data.password, data.email].filter((field) => field.length < 1).length > 0;

			if (fillMandatoryFields) {
				window.toast({
					type: 'error',
					message: lang.get(`ErrorFillMandatoryFields`)
				});
				return false;
			}

			const regex_username = new RegExp(`^[a-zA-Z0-9_]{3,16}$`);
			const regex_email = new RegExp(/^[^@\s]+@[^@\s.]+.[^@.\s]+$/);

			if (!regex_username.test(data.username) || isEmoji(data.username)) {
				window.toast({ type: 'error', message: lang.get(`ErrorUsernameInvalidChars`) });
				return false;
			}

			if (!regex_email.test(data.email)) {
				window.toast({ type: 'error', message: lang.get(`ErrorInvalidEmail`) });
				return false;
			}

			if (data.password.length < 6) {
				window.toast({ type: 'error', message: lang.get(`ErrorShortPassword`) });
				return false;
			}

			setSubmitted(true);

			const response = await interpetingRPCEvent(`Server`, 'registerAccount', JSON.stringify({ data }));

			setAccount((st: ExpectedAny) => {
				const currentState = st !== null ? st : {};
				return { ...currentState, ...response };
			});

			window.account = response;
			await createAmplitudeEvent(`Registered`);
			navigate('/characters/create');
		} catch (err: UndefinedAny) {
			let msg = lang.get(`ErrorTechnicalErrorClient`),
				loggable = true;
			if (err && err.statusCode) {
				switch (err.statusCode) {
					case 409: {
						msg = lang.get(`ErrorUsernameOrEmailUsed`);
						loggable = false;
						break;
					}

					default: {
						msg = lang.get(`ErrorTechnicalErrorServer`);
						break;
					}
				}
			}

			if (loggable) {
				await logError(`REGISTER`, err);
			}

			window.toast({ type: 'error', message: msg });
			setSubmitted(false);
		}
	};

	const gameLanguages = [
		{
			label: lang.get('LanguageEnglishLabel'),
			value: `EN`
		},
		{
			label: lang.get('LanguageRomanianLabel'),
			value: `RO`
		}
	];

	const changeGameLanguage = (value: keyof Languages) => {
		setData({ ...data, language: value });
		window.language = value;
	};

	return (
		<React.Fragment>
			<div className="heading">{lang.get('Heading')}</div>
			<div className="forms">
				<div className="form-group">
					<div className="label">{lang.get('UsernameLabel')}</div>
					<div className="element">
						<Input
							placeholder={lang.get('UsernameLabel')}
							fullWidth={true}
							value={data.username}
							disabled={submitted}
							onChange={(ev) => setData({ ...data, username: ev.target.value })}
							{...getCapsLockProps({
								id: `username`,
								capsLockEnabled,
								inputFocusedId,
								setInputFocusedId
							})}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="label">{lang.get('PasswordLabel')}</div>
					<div className="element">
						<Input
							placeholder={lang.get('PasswordLabel')}
							type="password"
							fullWidth={true}
							value={data.password}
							disabled={submitted}
							onChange={(ev) => setData({ ...data, password: ev.target.value })}
							{...getCapsLockProps({
								id: `password`,
								capsLockEnabled,
								inputFocusedId,
								setInputFocusedId
							})}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="label">{lang.get('EmailLabel')}</div>
					<div className="element">
						<Input
							placeholder={lang.get('EmailPlaceholder')}
							type="email"
							fullWidth={true}
							value={data.email}
							disabled={submitted}
							onChange={(ev) => setData({ ...data, email: ev.target.value })}
							{...getCapsLockProps({
								id: `email`,
								capsLockEnabled,
								inputFocusedId,
								setInputFocusedId
							})}
						/>
					</div>
				</div>
				<div className="form-group">
					<div className="label">{lang.get('LanguageLabel')}</div>
					<div className="element">
						<Select
							fullWidth
							disabled={submitted}
							value={data.language}
							variant="standard"
							onChange={(ev) => changeGameLanguage(ev.target.value as keyof Languages)}
						>
							{gameLanguages.map((language) => (
								<MenuItem key={language.value} value={language.value}>
									{language.label}
								</MenuItem>
							))}
						</Select>
					</div>
				</div>
			</div>
			<div className="buttons">
				<Button fullWidth={true} variant="contained" disabled={submitted} onClick={submit}>
					{lang.get('SubmitButton')}
					<ButtonLoader active={submitted} />
				</Button>

				<div className="divider" />

				<Button fullWidth disabled={submitted} color="secondary" onClick={() => setView('login')}>
					{lang.get('LoginButton')}
				</Button>
			</div>
		</React.Fragment>
	);
};

export default Register;
