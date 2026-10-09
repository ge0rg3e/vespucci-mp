// Databases
import DealershipsDb from '@modules/database/game/dealerships/repository';
import DealershipStocksDb from '@modules/database/game/dealershipStocks/repository';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';

// Other dependencies
import { formatNumber, logError } from '@server/utils/helpers';
import { green } from 'colorette';

export let Dealerships: Array<Dealership> = [];

export const loadDealerships = async () => {
	try {
		Dealerships = await DealershipsDb.getDealerships();

		// A simple count to show how many vehicles are available in the dealerships.
		let vehiclesCount = 0;

		for (let index = 0; index < Dealerships.length; index++) {
			const d = Dealerships[index];

			// Loading the stock..
			const stock: Array<DealershipStock> = await DealershipStocksDb.getStocksForDealership(d.id);
			Dealerships[index].stocks = stock;

			// Event
			mp.events.call(`onDealershipLoaded`, Dealerships[index]);

			// Increasing the count for the console log.
			stock.forEach(() => {
				vehiclesCount++;
			});
		}

		console.info(`${green('[DONE]')} Loaded ${Dealerships.length} dealerships (${formatNumber(vehiclesCount)} vehicles)`);

		// Inform server that dealerships have been loaded
		mp.events.call(`dealershipsLoaded`);
	} catch (err) {
		await logError(`LOAD_DEALERSHIPS`, err);
		process.exit(1);
	}
};

export const createDealership = async (name: string, blipType: number, coords: Vector3) => {
	try {
		const d: ExpectedAny = {
			name,
			blipType,
			coords: JSON.stringify({
				x: coords.x,
				y: coords.y,
				z: coords.z
			})
		};
		const DealershipCreated = await DealershipsDb.createDealership(d);

		Dealerships.push({
			...DealershipCreated,
			stocks: []
		});

		// Load dependencies
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`dealerships:loadDependencies`, player, DealershipCreated);
		});

		return DealershipCreated;
	} catch (err) {
		await logError(`CREATE_DEALERSHIP`, err, {
			name,
			blipType,
			coords
		});
		return null;
	}
};

export const deleteDealership = async (dealershipId: number) => {
	try {
		const d = Dealerships.find((d) => d.id === dealershipId)!;
		if (!d) return false;

		// Delete it from database
		await DealershipsDb.destroy({
			where: {
				id: dealershipId
			}
		});

		// Delete stock from database
		await DealershipStocksDb.destroy({
			where: {
				dealershipId: dealershipId
			}
		});

		// Remove dependencies
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`dealerships:removeDependencies`, player, d);
		});

		// Call this event to remove him from dealership
		mp.events.call('onDealershipDelete', d);

		const index = Dealerships.findIndex((d) => d.id === dealershipId);
		if (index === -1) return false;

		Dealerships.splice(index, 1);

		return true;
	} catch (err) {
		await logError(`DELETE_DEALERSHIP`, err, { dealershipId });
		return false;
	}
};

export const updateDealership = async (dealershipId: number, fields?: Partial<House>, updateDatabase = false) => {
	try {
		const args: ExpectedAny = { ...fields };

		const fieldMustBeStringified = ['coords'];
		const fieldMustBeDeleted = ['stocks']; // Just in case by mistake we ever try to update this.

		// Stringifying..
		Object.keys(args).forEach((key: string) => {
			if (fieldMustBeStringified.includes(key)) {
				args[key] = JSON.stringify(args[key]);
			}
		});

		// Deleting now the ones not supposed..
		Object.keys(args).forEach((key: string) => {
			if (fieldMustBeDeleted.includes(key)) {
				delete args[key];
			}
		});

		if (updateDatabase === true) {
			DealershipsDb.update(args, { where: { id: dealershipId } });
		}

		const indexOf = Dealerships.findIndex((elm) => elm.id === dealershipId);
		if (indexOf === -1) throw new Error(`Failed to find index of dealership with id ${dealershipId}`);

		// Update array
		Dealerships[indexOf] = {
			...Dealerships[indexOf],
			...fields
		};

		// Update dealership...
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`dealerships:removeDependencies`, player, Dealerships[indexOf]);
			mp.events.call(`dealerships:loadDependencies`, player, Dealerships[indexOf]);
		});
	} catch (err) {
		await logError(`UPDATE_DEALERSHIP`, err, {
			dealershipId,
			fields
		});
	}
};

export const updateDealershipStock = async (dealershipId: number, stockId: number, fields?: Partial<DealershipStock>, updateDatabase = false) => {
	try {
		const args: ExpectedAny = { ...fields };

		// const fieldMustBeDeleted = ['']; // Just in case by mistake we ever try to update this.

		// // Stringifying..
		// Object.keys(args).forEach((key: string) => {
		// 	if (fieldMustBeStringified.includes(key)) {
		// 		args[key] = JSON.stringify(args[key]);
		// 	}
		// });

		if (updateDatabase === true) {
			DealershipStocksDb.update(args, { where: { id: stockId, dealershipId } });
		}

		const dsIndexOf = Dealerships.findIndex((elm) => elm.id === dealershipId);
		if (dsIndexOf === -1) throw new Error(`Failed to find dealership index id.`);

		const stockIndexOf = Dealerships[dsIndexOf].stocks.findIndex((elm) => elm.id === stockId);
		if (stockIndexOf === -1) throw new Error(`Failed to find dealership stock index id.`);

		Dealerships[dsIndexOf].stocks[stockIndexOf] = {
			...Dealerships[dsIndexOf].stocks[stockIndexOf],
			...fields
		};

		return true;
	} catch (err) {
		await logError(`UPDATE_DEALERSHIP_STOCK`, err, {
			dealershipId,
			stockId,
			fields
		});
		return false;
	}
};

export const reloadDealershipsStockData = async () => {
	for (let index = 0; index < Dealerships.length; index++) {
		const d = Dealerships[index];
		// Loading the stock..
		const stock: Array<DealershipStock> = await DealershipStocksDb.getStocksForDealership(d.id);
		Dealerships[index].stocks = stock;
	}
};

export const getDealershipInterfaceData = async (dealershipId: number) => {
	// Getting the dealership data
	const dealershipData = Dealerships.find((d) => d.id === dealershipId);
	if (!dealershipData) return false;

	// Cloning the data since we're gonna manipulate it and let's not risk anything..
	const dealership: ExpectedAny = { ...dealershipData };

	// Let's load the native info for all the models..
	for (let index = 0; index < dealership.stocks.length; index++) {
		const stock = dealership.stocks[index];
		const nativeInfo = getVehicleNativeInfo({ model: stock.model });

		// If the native info does not exist (0 chances);
		if (!nativeInfo) continue;

		// Let's load the native info for the vehicle so we can display it in the front-end accordingly.
		dealership.stocks[index].nativeInfo = nativeInfo;
	}

	// Filtering out any vehicles without native infos.
	dealership.stocks = dealership.stocks.filter((stock: ExpectedAny) => stock.nativeInfo !== undefined);

	return dealership;
};
