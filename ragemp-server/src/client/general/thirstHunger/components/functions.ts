import { getPlayerVariable } from '@client/utils/helpers';

const player = mp.players.local;

export const isFacingStarvationOrThirst = (dangerousLevel = false) => {
	const hunger = getHungerPoints();
	const thirst = getThirstPoints();

	const amount = dangerousLevel ? 80 : 50;

	return hunger >= amount || thirst >= amount ? true : false;
};

export const getHungerPoints = () => {
	const hungerPoints = getPlayerVariable(player.remoteId, `hungerPoints`);
	if (!hungerPoints) return 0;

	return hungerPoints;
};

export const getThirstPoints = () => {
	const thirstPoints = getPlayerVariable(player.remoteId, `thirstPoints`);
	if (!thirstPoints) return 0;

	return thirstPoints;
};

export const startLimping = () => {
	if (!mp.game.streaming.hasClipSetLoaded('move_m@injured')) {
		const start = Date.now();
		mp.game.streaming.requestClipSet('move_m@injured');
		while (!mp.game.streaming.hasClipSetLoaded('move_m@injured') && Date.now() - start < 500) mp.game.wait(0);
	}
	mp.players.local.setMovementClipset('move_m@injured', 0.25);
};

export const stopLimping = () => {
	mp.players.local.resetMovementClipset(0.0);
	mp.players.local.resetWeaponMovementClipset();
	mp.players.local.resetStrafeClipset();
};

export function calculateSetTimecycleModifier(hungerPoints: number, thirstPoints: number) {
	// Determine the worst condition (the highest value between hungerPoints and thirstPoints)
	const minModifier = 0.3;
	const maxModifier = 1.0;

	// Determine the worst condition (the highest value between hungerPoints and thirstPoints)
	const worstCondition = Math.max(hungerPoints, thirstPoints);

	// Calculate the scaling factor based on the worst condition
	const scalingFactor = worstCondition / 100;

	// Calculate the setTimecycle modifier based on the scaling factor
	let modifier = minModifier + scalingFactor * (maxModifier - minModifier);

	// Ensure the modifier is within the valid range (minModifier to maxModifier)
	modifier = Math.min(Math.max(modifier, minModifier), maxModifier);

	return modifier;
}
