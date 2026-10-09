import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Tunning:Purchase', {
	NotEnoughMoney: {
		EN: ({ value }) => `You don't have ${formatNumber(value, true)} to pay the repairs.`,
		RO: ({ value }) => `Nu ai ${formatNumber(value, true)} pentru a plăti pentru reparații.`
	},
	RequiresItem: {
		EN: ({ itemName }) => `You need the following item: ${itemName}`,
		RO: ({ itemName }) => `Ai nevoie de urmatorul item: ${itemName}`
	},
	VehicleRepaired: {
		EN: 'Your vehicle is now repaired.',
		RO: 'Vehiculul tau este acum reparat.'
	}
});

createLanguagePack('Tunning:Messages', {
	OnlyOwnerCanTune: {
		EN: () => `Only the owner of this personal vehicle can tune it.`,
		RO: () => `Doar propietarul acestui vehicul personal il poate tuna.`
	},
	LeftAsPassenger: {
		EN: 'You left the tunning as a passenger.',
		RO: 'Ai iesit din tunning ca pasager.'
	},
	DriverLeft: {
		EN: 'The driver of the vehicle has disconnected from the game.',
		RO: 'Soferul vehiculului s-a deconectat din joc.'
	},
	DriverOutsideVehicle: {
		EN: 'Tunning has stopped due to driver exiting his vehicle.',
		RO: 'Tunning a fost oprit din cauza ca soferul a parasit masina.'
	}
});
