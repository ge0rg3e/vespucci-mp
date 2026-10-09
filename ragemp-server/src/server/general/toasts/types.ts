type alertsType = 'success' | 'error' | 'warning' | 'info';

type params = {
	message: string;
	type: alertsType;
	seconds?: number /* 7 seconds recommended */;
	silent?: boolean;
};

declare global {
	interface PlayerMp {
		toast(params: params): void;
		clearToasts(): void;
	}
}

export {};
