declare global {
	interface Window {
		raisePhone: FixableAny;
		createPhoneNotification: FixableAny;
		deletePhoneNotification: FixableAny;
		raisePhoneManually: FixableAny;
		takeToLockScreen: FixableAny;
	}

	interface Phone {
		theme: 'light' | 'dark';
		uiStates: 'blurred' | 'loading' | 'opening';
	}
}

export {};
