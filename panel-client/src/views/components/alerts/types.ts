export type ComponentProps = {
	id: string;
	onMount?: (alerts: ExpectedAny) => void;
};

export type Type = 'error' | 'warning' | 'success';

export type DispatchParams = {
	listenerId: string;
	type: Type;
	message: string;
	seconds?: number;
};

declare global {
	interface Window {
		alerts: (listenerId: string) => {
			set: (type: Type, message: string, seconds?: number) => void /* Set the new alert messsage*/;
			reset: () => void /* This simply deletes the current alert message */;
		};
	}
}

export {};
