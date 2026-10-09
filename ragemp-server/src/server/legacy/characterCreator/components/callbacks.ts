import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';
import { defaultClothes } from './maps';

rpc.register('charCreator:GetClothesDefaultData', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { gender } = JSON.parse(args);

		// Get the default clothes for this gender..
		const newGender = gender === 'male' ? 'male' : 'female';
		const clothes = defaultClothes[newGender];
		player.info.clothes.gender = newGender;

		// Reset these in case they changed gender
		player.resetAllAppearancesComponents();
		player.resetAllClothingComponents();

		const newClothes = {
			...player.info.clothes,
			...clothes,
			gender,
			model: newGender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01'
		};

		return rpc.sendInterpetedResponse(200, newClothes);
	} catch (err) {
		await logError(`charCreator:GetClothesDefaultData`, err);
		return rpc.sendInterpetedResponse(400, null);
	}
});

rpc.register('charCreator:saveData', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { data: clothesData } = JSON.parse(args);

		player.updateVars({ loggedIn: true });

		player.triggerClientEvent('charCreator:DestroyInitialScene'); // destroy chair.
		player.triggerClientEvent('authentication:finish');

		// Required for cool transition.
		setTimeout(() => {
			const validPlayer = mp.players.at(player.id);
			if (!validPlayer) return; // The player may now be offline. Without this check the server may crash.
			mp.events.call('onPlayerSpawn', validPlayer);
			mp.events.call('onPlayerRegister', validPlayer);
		}, 2200);

		player.saveInfo({ isOnline: true, clothes: clothesData });

		player.createAmplitudeEvent('Created character', {
			gender: player.info.clothes.gender,
			language: player.info.language
		});

		return rpc.sendInterpetedResponse(200, 'Success');
	} catch (err: ExpectedAny) {
		await logError(`CREATE_CHARACTER`, err);
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.on('charCreator:updateModel', (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	const { model } = JSON.parse(args);
	player!.model = mp.joaat(model);
});

rpc.on('charCreator:updateClothes', (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	const { data: clothes } = JSON.parse(args);
	player!.updateClothes(clothes);
});
