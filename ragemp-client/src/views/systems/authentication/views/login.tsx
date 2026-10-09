import React, { useEffect, useRef, useState } from 'react';
import { Input, InputAdornment, Button, Checkbox } from '@mui/material';
import { AppContext } from '@/utils/context';
import { useNavigate } from 'react-router-dom';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LoginLanguage from './login.language';

i18n.createLanguagePack('SYSTEM_LOGIN', LoginLanguage);

// Components
import ButtonLoader from '../components/buttonLoader';
import { logError, interpetingRPCEvent, createAmplitudeEvent } from '@/utils/helpers';

interface LoginProps {
	setView: (view: string) => void;
}

export const getCapsLockProps = ({
	id,
	capsLockEnabled,
	inputFocusedId,
	setInputFocusedId
}: FixableAny) => ({
	id: id,
	onFocus: (ev: UndefinedAny) => setInputFocusedId(ev.target.id),
	onClick: (ev: UndefinedAny) => setInputFocusedId(ev.target.id),
	onBlur: () => setInputFocusedId(null),
	endAdornment:
		capsLockEnabled && inputFocusedId === id ? (
			<InputAdornment position="end">
				<div className="capsLockStatus">
					<i className="icon fa-solid fa-square-up"></i>
				</div>
			</InputAdornment>
		) : undefined
});

let autoLoginInterval: UndefinedAny = null;

const Login = ({ setView }: LoginProps) => {
	const { setAccount }: ExpectedAny = AppContext();
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();
	const lang = i18n.getLanguagePack('SYSTEM_LOGIN', window.language);
	const [capsLockEnabled, setCapsLockEnabled] = useState(false);
	const [inputFocusedId, setInputFocusedId] = useState<string | null>(null);
	const [autoLoginIn, setAutoLoginIn] = useState<number | null>(null);
	const [autoLoginAs, setAutoLoginInAs] = useState('');
	const [data, setData] = useState({
		username: '',
		password: ''
	});

	const dataRef = useRef(data);

	useEffect(() => {
		dataRef.current = data;
	}, [data]);

	const [rememberMeChecked, setRememberMeChecked] = useState(false);
	const rememberMeCheckedRef = useRef(false);

	useEffect(() => {
		rememberMeCheckedRef.current = rememberMeChecked;
	}, [rememberMeChecked]);

	const onKeyCapsListener = (event: UndefinedAny) => {
		if (event.key !== 'CapsLock') return false; // To prevent a bug MP-1010.
		setCapsLockEnabled(event.getModifierState('CapsLock') ? true : false);
	};

	const onRememberMeInitiated = (args: ExpectedAny) => {
		const { rememberMeCredentials } = JSON.parse(args);
		const [username] = rememberMeCredentials;
		// First argument to this function is the token from client-side. If ever needed.
		setAutoLoginIn(5);

		if (username) {
			setAutoLoginInAs(username);
			setData({ ...data, username });
		}

		setRememberMeChecked(true);

		autoLoginInterval = setInterval(() => {
			setAutoLoginIn((currentState: ExpectedAny) => {
				const number = currentState - 1;
				if (number < 1) {
					if (autoLoginInterval !== null) {
						// Clear interval
						clearInterval(autoLoginInterval);

						// Reset interval id
						autoLoginInterval = null;
					}

					submit(true);
				}

				return number;
			});
		}, 1000);
	};

	useEffect(() => {
		window.addEventListener('keyup', onKeyCapsListener);
		window.rpc.on('onRememberMeInitiated', onRememberMeInitiated);

		return () => {
			window.removeEventListener('keyup', onKeyCapsListener);
			window.rpc.off('onRememberMeInitiated', onRememberMeInitiated);

			window.clearToasts();

			if (autoLoginInterval !== null) {
				// Clear interval
				clearInterval(autoLoginInterval);

				// Reset id
				autoLoginInterval = null;
			}
		};
	}, []);

	const submit = async (skipMandatoryFields = false) => {
		try {
			if (window.mp.fake) {
				return window.toast({
					type: 'error',
					message: lang.get(`ErrorRageEnvironmentOnly`)
				});
			}

			if (
				[dataRef.current.username, dataRef.current.password].filter(
					(field) => field.length < 1
				).length > 0 &&
				skipMandatoryFields === false
			) {
				window.toast({ message: lang.get(`ErrorFillMandatoryFields`), type: 'error' });
				return false;
			}

			setSubmitted(true);

			const response = await interpetingRPCEvent(
				'Server',
				'loginAccount',
				JSON.stringify({
					data: dataRef.current,
					rememberMeChecked: rememberMeCheckedRef.current
				})
			);

			setAccount((st: ExpectedAny) => {
				const currentState = st !== null ? st : {};
				return { ...currentState, ...response };
			});

			window.account = response;

			await createAmplitudeEvent(`Logged In`, { justRegistered: response.justRegistered });

			if (response._banned === true) {
				await createAmplitudeEvent(`Banned`);
				navigate(`/kick-screen`);
				return false;
			}

			navigate(response.justRegistered ? '/characters/create' : '/');
		} catch (err: UndefinedAny) {
			let msg = lang.get(`ErrorTechnicalErrorClient`);
			let loggable = false;

			if (err && err.statusCode) {
				switch (err.statusCode) {
					case 404: {
						msg = lang.get(
							skipMandatoryFields
								? `ErrorRememberMeFailed`
								: `ErrorNameOrPasswordInvalid`
						);
						loggable = false;
						break;
					}
					case 409: {
						msg = lang.get(`ErrorNameOrPasswordInvalid`);
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
				await logError(`LOGIN`, err);
			}

			window.toast({ type: 'error', message: msg });
			setSubmitted(false);
			setAutoLoginIn(null);
			if (rememberMeCheckedRef.current === true && skipMandatoryFields === true) {
				setData({
					...dataRef.current,
					username: ''
				}); // to clear out the username field after a failed attempt.
			}
			setRememberMeChecked(false);
		}
	};

	const disableAutoLogin = () => {
		if (autoLoginInterval !== null) {
			// Reset interval
			clearInterval(autoLoginInterval);

			// Reset timer id
			autoLoginInterval = null;
		}

		setAutoLoginIn(null);
		setRememberMeChecked(false);
		setData({
			username: '',
			password: ''
		});
	};

	if (autoLoginIn !== null)
		return (
			<React.Fragment>
				<div className="heading">{lang.get('Heading')}</div>
				<div className={'auto-login'}>
					{autoLoginIn > 0 && <div className="big-number">{autoLoginIn}</div>}
					<div className="text-information">
						{lang.get('AutoLoginText', { submitted, username: autoLoginAs })}
					</div>
				</div>
				<div className="buttons">
					<Button
						fullWidth={true}
						variant="contained"
						disabled={submitted}
						onClick={disableAutoLogin}
					>
						{lang.get(`DisableAutoLogin`, { submitted })}
						<ButtonLoader active={submitted} />
					</Button>
				</div>
			</React.Fragment>
		);

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
							onKeyPress={(e) => {
								if (e.charCode === 13) {
									submit();
								}
							}}
							{...getCapsLockProps({
								id: `password`,
								capsLockEnabled,
								inputFocusedId,
								setInputFocusedId
							})}
						/>
					</div>
				</div>
				<div
					onClick={() => setRememberMeChecked(!rememberMeChecked)}
					className="form-checkbox"
				>
					<Checkbox size="small" checked={rememberMeChecked} />
					<div className="label">{lang.get('RememberMeLabel')}</div>
				</div>
			</div>
			<div className="buttons">
				<Button
					fullWidth={true}
					variant="contained"
					disabled={submitted}
					onClick={() => {
						submit();
					}}
				>
					{lang.get(`SubmitButton`)}
					<ButtonLoader active={submitted} />
				</Button>

				<div className="divider" />

				<Button
					fullWidth
					disabled={submitted}
					color="secondary"
					onClick={() => setView('register')}
				>
					{lang.get(`RegisterButton`)}
				</Button>
			</div>
		</React.Fragment>
	);
};

export default Login;
