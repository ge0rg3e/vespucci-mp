import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	NoVehicles: {
		EN: `You don't own any personal vehicles`,
		RO: `Nu ai nici un vehicul personal.`
	},
	NotSpawned: {
		EN: `Not spawned`,
		RO: 'Not spawned'
	},
	Spawned: {
		EN: ({ id }) => `Spawned (Entity Id ${id})`,
		RO: ({ id }) => `Spawned (Entity Id ${id})`
	},
	InGarage: {
		EN: ({ id }) => `In garage (Id: ${id})`,
		RO: ({ id }) => `In garaj (Id: ${id})`
	},
	Odometer: {
		EN: `Odometer`,
		RO: `Kilometraj`
	}
};

export default Language;
