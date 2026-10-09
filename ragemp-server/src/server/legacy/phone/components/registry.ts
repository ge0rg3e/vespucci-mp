import { red, yellow } from 'colorette';
import { PhoneApplication } from './types';

export class PhoneRegistry {
	private apps: PhoneApplication[] = [];

	public install(app: PhoneApplication) {
		const { id, checkAccess, sortNumber = null } = app;

		if (this.apps.find((i) => i.id === id)) {
			console.error(`${red('[ERROR]')} Phone app id already registered: ${yellow(id)}`);
			process.exit(1);
		}

		const entry: ExpectedAny = {
			id,
			checkAccess,
			sortNumber
		};

		return this.apps.push(entry);
	}

	public getHomeScreenApps(player: PlayerMp) {
		return this.apps
			.filter((app: PhoneApplication) => (app.checkAccess ? app.checkAccess(player) : true))
			.map((app: ExpectedAny) => ({
				id: app.id,
				sortNumber: app.sortNumber
			}));
	}

	public getApps() {
		return this.apps;
	}
}

mp.phone = new PhoneRegistry();

declare global {
	interface Mp {
		phone: PhoneRegistry;
	}
}
