import * as rpc from 'rage-rpc';

export let unableToDamage = false;

rpc.on(`setUnableToDoDamage`, (args) => {
	const { bool } = JSON.parse(args);
	unableToDamage = bool;
});

mp.events.add('render', () => {
	if (unableToDamage) {
		disableWeaponAttack();
	}
});

export const disableWeaponAttack = () => {
	mp.game.controls.disableControlAction(2, 24, true);
	mp.game.controls.disableControlAction(2, 25, true);
	mp.game.controls.disableControlAction(2, 69, true);
	mp.game.controls.disableControlAction(2, 70, true);
	mp.game.controls.disableControlAction(2, 92, true);
	mp.game.controls.disableControlAction(2, 114, true);
	mp.game.controls.disableControlAction(2, 121, true);
	mp.game.controls.disableControlAction(2, 140, true);
	mp.game.controls.disableControlAction(2, 141, true);
	mp.game.controls.disableControlAction(2, 142, true);
	mp.game.controls.disableControlAction(2, 257, true);
	mp.game.controls.disableControlAction(2, 263, true);
	mp.game.controls.disableControlAction(2, 264, true);
	mp.game.controls.disableControlAction(2, 331, true);
};
