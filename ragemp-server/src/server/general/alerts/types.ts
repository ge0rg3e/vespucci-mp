type alertsType = 'success' | 'error' | 'warning' | 'info';

type params = {
	heading?: string /* By default is: Success, Error, Warning, Information */;
	message: string;
	type: alertsType;
	seconds?: number /* 7 seconds recommended */;
	silent?: boolean;
	system?: string /* So we can know which alert is part of which system. */;
};

declare global {
	interface PlayerMp {
		alert(params: params): void;
		clearAlerts(): void;
		clearAlertsFromSystem(id: string): void;
	}
}

export {};
