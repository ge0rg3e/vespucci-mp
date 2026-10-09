import React, { useEffect } from 'react';

import { key } from '@/definitions/keys';

const Component = () => {
	const preventToxicKeyCombos = (e: UndefinedAny) => {
		if (e.ctrlKey && key(e, 'A')) {
			const inputFocused = document.activeElement;
			if (inputFocused && ['input', 'textarea'].includes(inputFocused.localName)) return true;
			// Bugfix MP-514
			e.preventDefault();
			return false;
		}
	};

	const isWritingIntoInput = () => {
		const inputFocused = document.activeElement;
		if (inputFocused && ['input', 'textarea'].includes(inputFocused.localName)) return true;
		return false;
	};

	useEffect(() => {
		document.addEventListener(`keydown`, preventToxicKeyCombos);
		window.rpc.register('isWritingIntoInput', isWritingIntoInput);
		return () => {
			document.removeEventListener(`keydown`, preventToxicKeyCombos);
			window.rpc.unregister('isWritingIntoInput');
		};
	}, []);

	return null;
};

export default Component;
