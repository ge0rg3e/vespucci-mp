import { RentingLocation } from '@server/legacy/vehiclesRenting/components/types';
import { Checkpoints } from '@server/natives/checkpoints/components/types';
import { itemCallbacks } from '@server/natives/items/components/types';

declare global {
	// eslint-disable-next-line
	type ExpectedAny = any;

	// eslint-disable-next-line
	type UndefinedAny = any;

	type LanguageCallback = {
		get: (languagePack: string, options?: Record<string, ExpectedAny>) => string;
	};

	type CoordsStreetName = {
		street: string;
		zone: string;
	};

	interface IServerEvents {
		// Player
		onPlayerSpawn: (player: PlayerMp) => void;
		loadPlayerDefaults: (player: PlayerMp) => void;
		playerLoggedInQuit: (player: PlayerMp, exitType: string, reason: string) => void;
		everyMinuteForPlayerTimer: (player: PlayerMp) => void;
		vehicleDeath: (vehicle: VehicleMp) => void;
		onPlayerLogin: (player: PlayerMp) => void;
		onPlayerRegister: (player: PlayerMp) => void;
		onPlayerEnterColshape: (player: PlayerMp, colshape: Colshape) => void;
		onPlayerExitColshape: (player: PlayerMp, colshape: Colshape) => void;
		onPlayerEnterCheckpoint: (player: PlayerMp, checkpoint: Checkpoints) => void;
		onPlayerExitCheckpoint: (player: PlayerMp, checkpoint: Checkpoints) => void;
		'afk:isAwayFromKeyboard': (player: PlayerMp, afkSeconds: number, afkMinutes: number) => void;
		'awayFromKeyboard:inactive': (player: PlayerMp) => void;
		'awayFromKeyboard:active': (player: PlayerMp) => void;
		loadPlayerMeta: (player: PlayerMp) => void;
		onPlayerSaveData: (player: PlayerMp, quit: boolean) => void;
		playerLoggedInDeath: (player: PlayerMp, reason: number, killer: PlayerMp | undefined) => void;

		// Actors
		onActorStreamIn: (player: PlayerMp, actor: ExpectedAny, isController: boolean) => void;
		onActorStreamOut: (player: PlayerMp, actor: ExpectedAny, isController: boolean, newController: PlayerMp) => void;
		onActorStreamEmpty: (actor: ExpectedAny) => void;
		onActorDeath: (actor: ExpectedAny) => void;

		// Vehicles
		onPlayerPressedVehicleLockKey: (player: PlayerMp, targetedVehicleId: number, autoLock?: boolean) => void;
		changeVehicleLockState: (ehicle: VehicleMp, state: boolean, bool2: boolean) => void;
		onVehiclesLoaded: (personalVehicles: Array<PersonalVehicle>) => void;
		despawnVehicle: (id: number, onDisconnect: boolean) => void;
		spawnVehicle: (id: number, args: ExpectedAny) => void;
		abandonVehicleInGarage: (id: number) => void;
		onVehicleSpawn: (entity: VehicleMp) => void;
		onVehiclesNativesLoaded: () => void;
		onPlayerDamageVehicle: (player: PlayerMp, vehicle: VehicleMp, lastHealth: number, newHealth: number) => void;

		// VoiceChat
		'voiceChat:startedSpeaking': (player: PlayerMp) => void;
		'voiceChat:changingChannels': (player: PlayerMp, oldChannel: null | string) => void;
		'voiceChat:stoppedSpeaking': (player: PlayerMp) => void;

		// Inventory
		onInventoryOpened: (player: PlayerMp) => void;
		onInventoryUpdate: (player: PlayerMp, action: keyof itemCallbacks) => void;
		onSeparateInventoryUpdated: (player: PlayerMp, newInventory: SeparatedInventory) => void;
		onSeparateInventoryClosed: (player: PlayerMp, newInventory: SeparatedInventory) => void;

		// Charcter Creator
		'charCreator:Start': (player: PlayerMp) => void;

		// Phone
		updatePhoneAppVehicles: (vehicleId: number, ownerId: number) => void;

		// Dealership
		showDealershipInterface: (player: PlayerMp, dealershipId: number) => void;
		reloadDealershipsStockData: () => void;
		onDealershipDelete: (dealership: Dealership) => void;
		'dealerships:loadDependencies': (player: PlayerMp, dealership: Dealership) => void;
		'dealerships:removeDependencies': (player: PlayerMp, dealership: Dealership) => void;

		// Houses
		'houses:loadDependencies': (player: PlayerMp, house: House) => void;
		'houses:removeDependencies': (player: PlayerMp, house: House) => void;
		onHouseDelete: (houseId: number) => void;
		onHouseUpdated: (house: House) => void;

		// Garages
		'garages:loadDependencies': (player: PlayerMp, garage: Garage) => void;
		'garages:removeDependencies': (player: PlayerMp, garage: Garage) => void;
		onGarageDeleted: (garage: Garage) => void;

		// Business
		'businesses:loadDependencies': (player: PlayerMp, business: Business) => void;
		'businesses:removeDependencies': (player: PlayerMp, business: Business) => void;
		'business:create': (business: Business) => void;
		'business:delete': (business: Business) => void;
		'business:callToActions.load': (player: PlayerMp, business: Business) => void;
		'business:callToActions.remove': (player: PlayerMp, business: Business) => void;
		'business:safezone.load': (player: PlayerMp, business: Business) => void;
		'business:safezone.delete': (player: PlayerMp, business: Business) => void;
		'business:buyPoint.load': (player: PlayerMp, business: Business) => void;
		'business:buyPoint.delete': (player: PlayerMp, business: Business) => void;
		'business:blip.load': (player: PlayerMp, business: Business) => void;
		'business:blip.delete': (player: PlayerMp, business: Business) => void;
		'business:actors.load': (business: Business) => void;
		'business:actors.delete': (business: Business) => void;

		// Business - Clothes
		refreshClothingDatabase: () => void;

		// Browser
		onBrowserLoaded: (player: PlayerMp) => void;

		// Dialogs
		onDialogResponse: (player: PlayerMp, response: DialogResponse) => void;

		// Renting
		'rentingLocation:loadDependencies': (player: PlayerMp, renting: RentingLocation) => void;
		'rentingLocation:removeDependencies': (player: PlayerMp, renting: RentingLocation) => void;

		// Timers
		everyMinuteForVehicleTimer: (vehicle: VehicleMp) => void;
		hourlyDataBackup: () => void;

		// Other
		createDefaultTranslations: () => void;
		pickNextWeatherInGame: () => void;
		gamemodeStarted: () => void;
		gamemodeLoaded: () => void;
	}
}

export {};
