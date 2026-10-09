declare global {
	type socketConnection = {
		fake: boolean;
		on: (name: string, callback: ExpectedAny) => void;
		off: (name: string) => void;
		join: (name: string) => void;
		leave: (name: string) => void;
		to: ExpectedAny;
		emit: (name: string, data: ExpectedAny) => void;
		simulateOn: (name: string, data: ExpectedAny) => void;
	};

	interface Window {
		socket: socketConnection;
	}

	interface Mp {
		fake: boolean;
	}
}

export {};
