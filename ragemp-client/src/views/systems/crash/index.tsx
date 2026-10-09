import React from 'react';

// Dependencies
import { logError, parseErrorBody } from '@/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './index.language';
const LanguagePackId = `SYSTEM_CRASH`;
i18n.createLanguagePack(LanguagePackId, LanguagePack);

// RPC Fixer on Browser
const mappedFakeEventFuncs: ExpectedAny = {};

if (!window.mp || window.mp.fake) {
	window.rpc = {
		on: (eventName: string, callBack: ExpectedAny) => {
			// look in helpers.tsx for window.callBrowserEvent
			mappedFakeEventFuncs[eventName] = ({ detail: eventData }: { detail: ExpectedAny }) => {
				callBack(eventData);
			};
			document.addEventListener(eventName, mappedFakeEventFuncs[eventName]);
		},
		off: (eventName: string) => {
			document.removeEventListener(eventName, mappedFakeEventFuncs[eventName]);
			delete mappedFakeEventFuncs[eventName];
		},
		callServer: () => {},
		callClient: () => {},
		register: () => {},
		unregister: () => {},
		triggerClient: () => {},
		triggerServer: () => {},
		invokeServer: () => {}
	} as ExpectedAny;
}

class ErrorBoundary extends React.Component {
	state = {
		hasError: false,
		message: null,
		lang: i18n.getLanguagePack(LanguagePackId, window.language)
	};

	constructor(props: ExpectedAny) {
		super(props);
	}

	static getDerivedStateFromError(error: ExpectedAny) {
		return { hasError: true, message: JSON.stringify(parseErrorBody(error)) };
	}

	async componentDidCatch(error: ExpectedAny) {
		await logError('CLIENT_CRASH', error);
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<React.Fragment>
					<div className="system-crash">
						<h1>{this.state.lang.get('Heading')}</h1>
						<p>{this.state.lang.get('Message')}</p>
						<b>{this.state.lang.get('Tip')}</b>
					</div>
				</React.Fragment>
			);
		}

		// eslint-disable-next-line
		return this.props.children;
	}
}

export default ErrorBoundary;
