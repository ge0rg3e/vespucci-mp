import { logError } from '@server/utils/helpers';
import { green } from 'colorette';
import GaragesDb from '@modules/database/game/garages/repository';

export let Garages: Array<Garage> = [];

export const loadGarages = async () => {
	try {
		// Load garages
		Garages = await GaragesDb.getGarages();

		// Announce..
		console.info(`${green('[DONE]')} Loaded ${Garages.length} garages`);
	} catch (err) {
		await logError(`LOAD_GARAGES`, err);
		process.exit(1);
	}
};

export const createGarage = async (ownerId: number, type: number, interiorId: number, coords: Vector3) => {
	try {
		// Prepare the variables
		const g: ExpectedAny = {
			ownerId,
			interiorId,
			coords,
			type
		};

		// Create the garage
		const EntityCreated = await GaragesDb.createGarage(g);

		// Add it to the array..
		Garages.push(EntityCreated);

		// Load dependencies for all players
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`garages:loadDependencies`, player, EntityCreated);
		});

		return EntityCreated;
	} catch (err) {
		await logError(`CREATE_GARAGE`, err, {
			ownerId,
			type,
			interiorId,
			coords
		});
		return null;
	}
};

export const deleteGarage = async (garageId: number) => {
	try {
		// Find index
		const index = Garages.findIndex((item: Garage) => item.id === garageId);
		if (index === -1) throw new Error(`There is no index in the array  of garages with id ${garageId}`);

		// Deelete it from database
		await GaragesDb.destroy({
			where: {
				id: garageId
			}
		});

		// Call event
		mp.events.call('onGarageDeleted', Garages[index]);

		// Remove dependencies for all players
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`garages:removeDependencies`, player, Garages[index]);
		});

		// Remove it from the array
		Garages.splice(index, 1);
	} catch (err) {
		await logError(`DELETE_GARAGES`, err, {
			garageId
		});
	}
};

export const updateGarage = async (garageId: number, fields?: Partial<Garage>, updateDatabase = false, avoidMarkersUpdate = false) => {
	try {
		// Get index
		const indexOf = Garages.findIndex((elm: Garage) => elm.id === garageId);
		if (indexOf === -1) throw new Error(`Failed to find garage index in the array of garages.`);

		// Extract arguments
		const args: ExpectedAny = { ...fields };

		// Fields that must be stringified
		const fieldMustBeStringified = ['coords'];

		// Stringify them..
		Object.keys(args).forEach((key: string) => {
			if (fieldMustBeStringified.includes(key)) {
				args[key] = JSON.stringify(args[key]);
			}
		});

		// Update..
		if (updateDatabase) {
			await GaragesDb.update(args, { where: { id: garageId } });
		}

		// Update array..
		Garages[indexOf] = {
			...Garages[indexOf],
			...fields
		};

		// @Reminder: We don't want to update all existing colshapes markers at payday for nothing.
		if (avoidMarkersUpdate === false) {
			// Reload dependencies
			mp.players.forEachLoggedIn((player: PlayerMp) => {
				mp.events.call(`garages:removeDependencies`, player, Garages[indexOf]);
				mp.events.call(`garages:loadDependencies`, player, Garages[indexOf]);
			});
		}
	} catch (err) {
		await logError(`UPDATE_GARAGE`, err, {
			garageId,
			fields
		});
	}
};
