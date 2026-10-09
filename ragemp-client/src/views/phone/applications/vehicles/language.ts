import { type LanguagePack } from '@vmp/i18n';
import moment from 'moment';

const Language: LanguagePack = {
	AppHeader_List: {
		EN: 'Personal vehicles',
		RO: 'Vehicule personale'
	},
	'VehStatus:Despawned': {
		EN: 'Despawned'
	},
	'VehStatus:Spawned': {
		EN: 'Spawned'
	},
	'VehStatus:InGarage': {
		EN: 'In garage',
		RO: 'In Garaj'
	},
	FormatOdometer: {
		EN: ({ val }) => (val === '0' ? 'Brand new' : `${val} KM`),
		RO: ({ val }) => (val === '0' ? 'Proaspăt cumpărată' : `${val} KM`)
	},
	Odometer: {
		EN: 'Odometer',
		RO: 'Kilometraj'
	},
	OwnedSince: {
		EN: ({ date }) => `Owned since ${moment(date).format('DD/MM/YYYY HH:mm')}`,
		RO: ({ date }) => `Deținător din ${moment(date).format('DD/MM/YYYY HH:mm')}`
	},
	'CallAction:Spawn': {
		EN: 'Spawn vehicle',
		RO: 'Spawn vehicul'
	},
	'CallAction:Despawn': {
		EN: 'Despawn vehicle',
		RO: 'Despawn vehicul'
	},
	'CallAction:TakeOutGarage': {
		EN: 'Take out of garage',
		RO: 'Scoate din garaj'
	},
	'AlertNotSpawned:Title': {
		EN: 'Information',
		RO: 'Informație'
	},
	'AlertNotSpawned:Description': {
		EN: ({ inGarage }) =>
			inGarage
				? `You cannot use this while in garage.`
				: 'This vehicle must be spawned first.',
		RO: ({ inGarage }) =>
			inGarage
				? `Nu poți folosii asta cât timp vehiculul este în garaj.`
				: 'Vehiculul trebuie spawnat întâi.'
	},
	Locked: {
		EN: 'Locked',
		RO: 'Încuiată'
	},
	Unlocked: {
		EN: 'Unlocked',
		RO: 'Descuiată'
	},
	Park: {
		EN: 'Park',
		RO: 'Parchează'
	},
	Location: {
		EN: 'Location',
		RO: 'Locație'
	},
	DatabaseId: {
		EN: 'Database ID',
		RO: 'Database ID'
	},
	EntityId: {
		EN: 'Entity ID',
		RO: 'Entity ID'
	},
	GarageId: {
		EN: 'Garage ID',
		RO: 'Garage ID'
	},
	FormatStatusLong: {
		EN: ({ val }) => {
			if (val === 1) return 'Spawned';
			else if (val === 2) return `In garaga`;
			return `Despawned`;
		},
		RO: ({ val }) => {
			if (val === 1) return 'Spawned';
			else if (val === 2) return `In garaj`;
			return `Despawned`;
		}
	},
	ManufactureDate: {
		EN: 'Manufacture date',
		RO: 'Data fabricație'
	},
	Fuel: {
		EN: 'Fuel',
		RO: 'Combustibil'
	},
	CurrentFuel: {
		EN: 'Current fuel',
		RO: 'Comustibil in rezervor'
	},
	FuelCapacity: {
		EN: 'Fuel tank capacity',
		RO: 'Capacitate rezervor'
	},
	Litres: {
		EN: 'Litres',
		RO: 'Litri'
	},
	Plate: {
		EN: 'Number plate',
		RO: 'Număr de înmatriculare'
	},
	AutomaticVehicleSpawn: {
		EN: 'Automatic vehicle spawn',
		RO: 'Spawn vehicul automat'
	},
	Yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	No: {
		EN: 'No',
		RO: 'Nu'
	},
	Owner: {
		EN: 'Owner',
		RO: 'Propietar'
	},
	'Action:FindVehicle': {
		EN: 'Show vehicle location',
		RO: 'Afiseaza locație vehicul'
	},
	'Action:RespawnVehicle': {
		EN: 'Respawn vehicle',
		RO: 'Respawn vehicul'
	},
	'Action:AutomaticSpawn': {
		EN: 'Automatic vehicle spawn',
		RO: 'Spawn vehicul automat'
	},
	'Action:AbandonVehicle': {
		EN: 'Abandon this vehicle',
		RO: 'Abandonează acest vehicul'
	},
	'AdminAction:ResetSpecificInfo': {
		EN: 'Reset specific information',
		RO: 'Resetează informații specifice'
	},
	'AdminAction:UpdateOdometer': {
		EN: 'Change odometer',
		RO: 'Schimbă kilometraj'
	},
	'AdminAction:UpdateOwner': {
		EN: 'Change owner',
		RO: 'Schimbă propietar'
	},
	'AutomaticSpawn:ActionSheetTitle': {
		EN: 'Automatic vehicle spawn',
		RO: 'Spawn vehicul automat'
	},
	'AutomaticSpawn:ActionSheetDescription': {
		EN: 'This vehicle will spawn automatically when you enter authenticate in-game.',
		RO: 'Acest vehicul se va spawna automat mereu după autentificarea ta în joc.'
	},
	Activate: {
		EN: 'Activate',
		RO: 'Activează'
	},
	Deactivate: {
		EN: 'Deactivate',
		RO: 'Dezactivează'
	},
	Cancel: {
		EN: 'Cancel',
		RO: 'Anulează'
	},
	'VehicleAbandonAlert:Title': {
		EN: 'Abandon vehicle',
		RO: 'Abandonează vehicul'
	},
	'VehicleAbandonAlert:Description': {
		EN: 'Are you sure you want to abandon this vehicle? You will delete this vehicle and you will not able to recover it.',
		RO: 'Ești sigur că vrei să abandonezi acest vehicul? Vei șterge acest vehicul și nu îl mai poti recupera.'
	},
	Confirm: {
		EN: 'Confirm',
		RO: 'Confirm'
	},
	'ResetSpecificInfo:ActionSheetTitle': {
		EN: 'Reset information',
		RO: 'Resetează informații'
	},
	'ResetSpecificInfo:ActionSheetDescription': {
		EN: 'Select what would you like to reset',
		RO: 'Selectează ce dorești să resetezi'
	},
	'ResetSpecificInfo:ConfirmationTitle': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'ResetSpecificInfo:ConfirmationContent': {
		EN: ({ type }) => `The ${type === 'inventory' ? 'inventory' : 'tunning'} have been reset`,
		RO: ({ type }) => `${type === 'inventory' ? 'Inventarul' : 'Tuningul'} a fost resetat`
	},
	'ChangeOdometer:Instructions': {
		EN: 'Enter the new odometer value',
		RO: 'Introduceți noua valoare a kilometrajului'
	},
	'ChangeOdometer:Placeholder': {
		EN: 'Kilometers',
		RO: 'KilometriS'
	},
	'ChangeOdometer:ConfirmationTitle': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'ChangeOdometer:ConfirmationDescription': {
		EN: 'The odometer has been updated',
		RO: 'Kilometrajul vehiculului a fost actualizat.'
	},
	'ChangeOdometer:ValueOverTheLimit': {
		EN: 'Number is too big.',
		RO: 'Numărul pare a fi prea mare.'
	},
	'ChangeOdometer:ValueBelowTheLimit': {
		EN: 'Number must be at least a zero.',
		RO: 'Numărul trebuie să fie cel puțin zero.'
	},
	'ChangeOwner:Instructions': {
		EN: 'Enter the new owner name',
		RO: 'Introduceți numele noului proprietar'
	},
	'ChangeOwner:Placeholder': {
		EN: 'Name',
		RO: 'Nume'
	},
	'ChangeOwner:ConfirmationTitle': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'ChangeOwner:ConfirmationDescription': {
		EN: 'The owner of this vehicle have been updated successfully',
		RO: 'Proprietarul vehiculului a fost actualizat cu succes'
	},
	'ChangeOwner:FailedTitle': {
		EN: 'Having Difficulties',
		RO: 'Întâmpinăm dificultăți'
	},
	'ChangeOwner:FailedDescription': {
		EN: 'Failed to find a player with that name.',
		RO: 'Nu există nici un jucător online cu acel nume.'
	},
	'ChangeOwner:NoValue': {
		EN: 'The name is not valid.',
		RO: 'Numele nu este valid.'
	},
	'HavingDifficulties:Title': {
		EN: 'Having Difficulties',
		RO: 'Întâmpinăm dificultăți'
	},
	'HavingDifficulties:Description': {
		EN: "We're experiencing errors. Please try again.",
		RO: 'Experimentăm dificultăți, încearcă din nou te rog.'
	},
	ExpiresAt: {
		EN: 'Expires at',
		RO: 'Expiră la data'
	}
};

export default Language;
