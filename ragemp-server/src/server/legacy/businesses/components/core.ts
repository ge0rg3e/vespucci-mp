import { logError } from '@server/utils/helpers';
import { green } from 'colorette';

import Accounts from '@modules/database/game/accounts/repository';
import BusinessesDb from '@modules/database/game/businesses/repository';

export let Businesses: Array<Business> = [];

export const loadBusinesses = async () => {
	try {
		Businesses = await BusinessesDb.getBusinesses();
		Businesses.forEach((b: Business) => {
			// Call this event to perform server-side things when gamemode starts.
			mp.events.call('business:create', b);
		});
		console.info(`${green('[DONE]')} Loaded ${Businesses.length} businesses`);
	} catch (err) {
		await logError(`LOAD_BUSINESSES`, err);
		process.exit(1);
	}
};

export const createBusiness = async (type: number, level: number, price: number, locations: BusinessLocations) => {
	try {
		const b: ExpectedAny = {
			type,
			level,
			price,
			locations
		};
		const EntityCreated = await BusinessesDb.createBusinesses(b);
		Businesses.push(EntityCreated);

		// Emit the event
		mp.events.call('business:create', EntityCreated);

		// Create the dependencies for the players
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`businesses:loadDependencies`, player, EntityCreated);
		});

		return EntityCreated;
	} catch (err) {
		await logError(`CREATE_BUSINESS`, err, {
			type,
			level,
			price,
			locations
		});
		return null;
	}
};

export const deleteBusiness = async (businessId: number) => {
	try {
		const b = Businesses.find((b) => b.id === businessId)!;

		if (b.owned) {
			await Accounts.update(
				{
					business: 0
				},
				{
					where: {
						username: b.ownerName
					}
				}
			);
		}

		await BusinessesDb.destroy({
			where: {
				id: businessId
			}
		});

		// Call event to execute server-side events when a business is deleted
		mp.events.call('business:delete', b);

		// Remove dependencies for players
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`businesses:removeDependencies`, player, b);
		});

		// Update sv-side array
		const index = Businesses.findIndex((item) => item.id === businessId);
		if (index === -1) throw new Error(`Failed to find business in the array of businesses.`);

		Businesses.splice(index, 1);
	} catch (err) {
		await logError(`DELETE_BUSINESS`, err, {
			businessId
		});
	}
};

export const updateBusiness = async (businessId: number, fields?: Partial<Business>, updateDatabase = false, avoidMarkersUpdate = false) => {
	try {
		const args: ExpectedAny = { ...fields };

		const fieldMustBeStringified = ['locations', 'configs'];

		Object.keys(args).forEach((key: string) => {
			if (fieldMustBeStringified.includes(key)) {
				args[key] = JSON.stringify(args[key]);
			}
		});

		if (updateDatabase) {
			BusinessesDb.update(args, { where: { id: businessId } });
		}

		const indexOf = Businesses.findIndex((elm) => elm.id === businessId);
		Businesses[indexOf] = {
			...Businesses[indexOf],
			...fields
		};

		// @Reminder: We don't want to update all existing colshapes markers at payday for nothing.
		if (avoidMarkersUpdate === false) {
			// Reload the players dependencies
			mp.players.forEachLoggedIn((player: PlayerMp) => {
				mp.events.call(`businesses:removeDependencies`, player, Businesses[indexOf]);
				mp.events.call(`businesses:loadDependencies`, player, Businesses[indexOf]);
			});
		}
	} catch (err) {
		await logError(`UPDATE_BUSINESS`, err, {
			businessId,
			fields
		});
	}
};

export const reloadBusinessData = async (businessId: number) => {
	try {
		const data: ExpectedAny = await BusinessesDb.findOne({
			where: {
				id: businessId
			}
		});

		if (!data) throw new Error(`Failed to find data of business id ${businessId}`);

		// Prepare the data..
		const bizzData: ExpectedAny = {
			...data.toJSON(),
			locations: JSON.parse(data.toJSON().locations),
			configs: JSON.parse(data.toJSON().configs)
		};

		// Updating server-data..
		const bIndex = Businesses.findIndex((b) => b.id === businessId);
		if (bIndex === -1) throw Error(`Failed to find index of bizz in businesses variable`);

		// Delete current business from in-game
		mp.events.call('business:delete', Businesses[bIndex]);

		// Remove the players dependencies
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`businesses:removeDependencies`, player, Businesses[bIndex]);
		});

		// Update the data
		Businesses[bIndex] = bizzData;

		// Create it again to update markers and everything.
		mp.events.call('business:create', Businesses[bIndex]);

		// Create the players dependencies
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`businesses:loadDependencies`, player, Businesses[bIndex]);
		});
	} catch (err) {
		await logError(`RELOAD_BUSINESS`, err, { businessId });
	}
};
