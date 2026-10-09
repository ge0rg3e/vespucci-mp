import { mapClothesPlurals } from '@src/utils/helpers';
import { getCache, setCache } from '@src/utils/cache';

import { createRouter } from '@natives/router';

// Validation
import { profileSchema } from './validation';

// Database
import AccountsDb from '@modules/database/game/accounts/repository';
import Actions from '@modules/database/shared/actions/repository';
import ClothesDb from '@modules/database/natives/clothes/repository';
import Busineses from '@modules/database/game/businesses/model';
import Vehicles from '@modules/database/game/vehicles/model';
import Houses from '@modules/database/game/houses/model';
import { Op } from 'sequelize';

const convertToSingular = (key: string) => (mapClothesPlurals[key] ? mapClothesPlurals[key] : key);

// Creating a new router..
const route = createRouter('profiles');

route.set({
	path: '/:username',
	method: 'GET',
	options: {
		validateParams: profileSchema
	},
	handler: async (req, res) => {
		// Return cache if possible
		const cache = await getCache(`profiles:${req.params.username}`);

		// If there is a cache return it..
		if (cache) return res.sendResponse(200, cache);

		// Get the account data...
		let data: ExpectedAny = await AccountsDb.findOne({
			where: {
				username: req.params.username
			},
			include: [
				{
					model: Vehicles,
					attributes: ['id', 'status', 'model', 'odometer', 'createdAt', 'displayName', 'garageId', 'modifications'],
					where: { ownerName: req.params.username },
					required: false,
					as: 'vehicles'
				},
				{
					model: Houses,
					attributes: ['id', 'interiorId', 'isRenting', 'title', 'upgradeLevel', 'createdAt'],
					required: false,
					as: 'houseData'
				},
				{
					model: Busineses,
					attributes: ['id', 'type', 'level', 'createdAt'],
					required: false,
					as: 'businessData'
				}
			]
		});

		// If there is no data found (aka invalid account)
		if (!data) return res.sendResponse(404, 'Profile not found');

		// Get their faction actions..
		const actions: FixableAny = await Actions.findAllTranslated({
			where: {
				accountId: data.dataValues.id
			},
			limit: 10,
			order: [['createdAt', 'desc']]
		});

		// Format the data nicely...
		data = data.dataValues;
		data.vehicles = data.vehicles.map((veh: ExpectedAny) => ({ ...veh.dataValues, modifications: JSON.parse(veh.dataValues.modifications) }));

		// Get the clothes details: name, image etc.
		const accountClothes = JSON.parse(data.clothes);

		// Preparing the result for the front-end
		const clothes: ExpectedAny = {};

		if (Object.keys(accountClothes).length > 0) {
			const clothesToFind = Object.values(accountClothes).filter((x: ExpectedAny) => x.drawableId);

			const clothesDetails: ExpectedAny = await ClothesDb.findAll({
				where: {
					[Op.or]: clothesToFind.map((clothes: ExpectedAny) => ({
						gender: accountClothes.gender,
						drawableId: clothes.drawableId,
						textureId: clothes.textureId,
						isAddon: clothes.isAddon
					}))
				}
			});

			// Mapping them..
			clothesDetails.forEach((c: FixableAny) => (clothes[convertToSingular(c.dataValues.type)] = c.dataValues));
		}

		// Prepare and cache the resposne
		const responseData = { ...data, actions, clothes };

		// Cache it for the next user..
		await setCache(`profiles:${req.params.username}`, responseData, 5 * 60);

		// Returning the response..
		return res.sendResponse(200, responseData);
	}
});

export default route;
