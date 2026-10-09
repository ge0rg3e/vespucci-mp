import { GarageInterior, GarageInteriors } from '@server/definitions/garageInteriors';
import { Houses } from '../../houses/components/core';
import { createGarage, deleteGarage, Garages, updateGarage } from './core';

mp.commands.addCommand({
	name: `gints`,
	aliases: ['garageinteriors'],
	permission: `cmds.creategarage`,
	defineLangs: {
		Interiors: {
			EN: ({ interiors }) =>
				`Garage interiors: {BR} - ${interiors
					.map(
						(int: GarageInterior, ix: number) =>
							`{b9b9b9}(${int.id}){FFFFFF} ${int.name} (${int.coords.parkings.length} parkings) ${
								[2, 5, 8, 11, 14, 17, 20].includes(ix) ? `{BR}-  ` : ix === interiors.length - 1 ? '' : ', '
							}`
					)
					.join('')}`,
			RO: ({ interiors }) =>
				`Interioare de garaj: {BR} - ${interiors
					.map(
						(int: GarageInterior, ix: number) =>
							`{b9b9b9}(${int.id}){FFFFFF} ${int.name} (${int.coords.parkings.length} parcări) ${
								[2, 5, 8, 11, 14, 17, 20].includes(ix) ? `{BR}-  ` : ix === interiors.length - 1 ? '' : ', '
							}`
					)
					.join('')}`
		},

		IntID4Variants: {
			EN: '- Interior ID 4 Variants: (1) Chroma, (2) White, (3) Black, (4) Grey, (5) Wooden, (6) American, (7) Japanese Grafitti, (8) American Graffiti, (9) Purple',
			RO: '- Interior ID 4 variante: (1) Chroma, (2) White, (3) Black, (4) Grey, (5) Wooden, (6) American, (7) Japanese Grafitti, (8) American Graffiti, (9) Purple'
		}
	},
	handler: (player, _, lang) => {
		player.sendServerMessage('Server', 'staff', lang(player.lang, 'Interiors', { interiors: GarageInteriors }), 'system');
		player.sendServerMessage('Server', 'staff', lang(player.lang, 'IntID4Variants'), 'system');
	}
});

mp.commands.addCommand({
	name: 'creategarage',
	aliases: ['cgrage'],
	permission: `cmds.creategarage`,
	defineLangs: {
		InteriorError: {
			EN: `Invalid garage interior. Choose a number between 1 and 4.`,
			RO: `Id-ul interiorului este invalid. Alege un număr intre 1 și 4.`
		},
		HouseError: {
			EN: `Invalid house id.`,
			RO: `Id-ul casei este invalid.`
		},
		GarageError: {
			EN: `This house already has a garage.`,
			RO: `Aceasta casa are deja un garaj.`
		},
		VariantInvalidIntId4: {
			EN: `Invalid variant ID.`,
			RO: `ID Varianta invalida.`
		},
		Announcement: {
			EN: ({ admin, house, id, int }) => `${admin} created garage id ${id} with interior Id ${int} for house id ${house}.`,
			RO: ({ admin, house, id, int }) => `${admin} a creat garajul cu id ${id} cu interior Id ${int} pentru casa cu id-ul ${house}.`
		},
		InvalidType: {
			EN: () => `Invalid garage type. Valid types: (1) House`,
			RO: () => `Invalid tip de garaj. Tipuri valide: (1) Casă`
		}
	},
	args: {
		// type: 'number',
		houseId: 'number',
		interior_id: 'number',
		variant_id: 'number'
	},
	argsRequired: {
		variant_id: ([_, intId]) => intId === '4'
	},
	handler: async (player, { houseId, interior_id, variant_id }, lang) => {
		if (interior_id < 1 || interior_id > 4) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'InteriorError'), 'system');
		if (!Houses.find((h) => h.id === houseId)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'HouseError'), 'system');
		if (Garages.find((g) => g.ownerId === houseId && g.type === 1)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'GarageError'), 'system');
		if (interior_id === 4 && (variant_id < 1 || variant_id > 9)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'VariantInvalidIntId4'), 'system');
		// if (![1].includes(type)) return player.sendErrorMessage(lang(player.lang, 'InvalidType'));

		const type = 1; // for now there is only one type 1.
		const g = await createGarage(houseId, type, interior_id, player.position);

		if (!g) return false; // safety check

		if (variant_id) {
			updateGarage(g.id, { variantId: variant_id }, true);
		}

		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:creategarage',
			permission: 'cmds.creategarage',
			messageId: 'Announcement',
			args: () => ({
				admin: player.info.username,
				house: houseId,
				id: g.id,
				int: interior_id === 4 ? `${interior_id} (Variant ${variant_id})` : interior_id
			})
		});

		player.createAmplitudeEvent(`Created garage`, {
			idCreated: g.id,
			variant_id: interior_id === 4 ? variant_id : 'N/A',
			interior_id,
			house_id: houseId
		});
	}
});

mp.commands.addCommand({
	name: 'deletegarage',
	aliases: ['dgarage'],
	permission: 'cmds.deletegarage',
	defineLangs: {
		GarageInvalid: {
			EN: `The garage id is not valid.`,
			RO: `Acest id de garaj nu este valid.`
		},
		Announcement: {
			EN: ({ admin, garageId, reason }) => `${admin} deleted a garage with id ${garageId} for ${reason}.`,
			RO: ({ admin, garageId, reason }) => `${admin} a sters garajul cu id-ul ${garageId} pe motiv ${reason}.`
		}
	},
	args: {
		garage_id: 'number',
		reason: 'fullText'
	},
	handler: async (player, { garage_id, reason }, lang) => {
		if (!Garages.find((g) => g.id === garage_id)) return player.sendErrorMessage('Server', 'system', lang(player.lang, 'GarageInvalid'), 'system');
		deleteGarage(garage_id);
		mp.chat.sendStaffMessageToAll({
			systemId: 'cmdLangs:deletegarage',
			messageId: 'Announcement',
			permission: 'cmds.deletegarage',
			args: () => ({
				admin: player.info.username,
				garageId: garage_id,
				reason
			})
		});
		player.createAmplitudeEvent(`Deleted garage`, {
			garage_id,
			reason
		});
	}
});
