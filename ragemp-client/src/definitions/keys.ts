const keys: ExpectedAny = {
	Escape: 27,
	Space: 32,
	Enter: 13,
	Tab: 9,
	ArrowUp: 38,
	CapsLock: 20,
	ArrowDown: 40,
	ArrowLeft: 37,
	ArrowRight: 39,
	Backspace: 8,
	Delete: 46,
	PageUp: 33,
	PageDown: 34,

	A: 65,
	D: 68
};

type Keys =
	| 'Escape'
	| 'Space'
	| 'Enter'
	| 'Tab'
	| 'ArrowUp'
	| 'CapsLock'
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight'
	| 'Backspace'
	| 'Delete'
	| 'PageUp'
	| 'PageDown'
	| 'A'
	| 'D';

export const key = (e: ExpectedAny, key: Keys) => e.which === keys[key] || false;
