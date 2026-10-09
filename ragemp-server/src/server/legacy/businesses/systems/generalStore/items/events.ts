import { playRangedAudio } from '@server/natives/audio';
import { getLanguagePack } from '@vmp/i18n';
import { UseFoodItemParams } from './types';

mp.events.add(`onFoodConsumed:donut`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`FoodAndDrinks:General`, player.lang);

	// Safet checks..
	if (player.isHoldingConsumable()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	}

	// Safet checks..
	if (!player.isAvailableToConsume()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });
	}

	// Feed the player..
	player.reduceHungerPoints(params.points);

	// Reduce item quantity from inventory..
	player.reduceItem(params.item.data.id, 1);

	// Track on amplitude
	player.createAmplitudeEvent(`Eating food`, { id: 'donut', hungerPointsReduced: params.points });

	// @Feature: this allows the player to eat or drink items fast when he's in a hurry without waiting 3 seconds.
	if (!player.isHoldingConsumable() && !player.isDrinking() && !player.isEating()) {
		// Play the right sound
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/items/food/eating.mp3`,
			options: {
				volume: 0.8,
				spatialSound: {
					source: 'position',
					position: player.position,
					maxDistance: 5
				}
			},
			position: player.position,
			isSoundEffect: true,
			range: 5
		});

		// Update status..
		player.updateVars({ isEating: true });

		// Give attachment
		player.giveAttachment('donut');

		// Play animation...
		player.applyAnimation({
			dict: 'mp_player_inteat@burger',
			name: 'mp_player_int_eat_burger',
			speed: 1,
			flags: 51,
			duration: 3000,
			onCallback: (player, stopAnim) => {
				// Mark he's not eating anymore..
				player.updateVars({ isEating: false });

				// Stop current anim
				stopAnim();

				// Take away the attachment
				player.removeAttachment('donut');
			}
		});
	}

	return true;
});

mp.events.add(`onFoodConsumed:sandwich`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`FoodAndDrinks:General`, player.lang);

	// Safet checks..
	if (player.isHoldingConsumable()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	}

	// Safet checks..
	if (player.isHoldingConsumable()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	}

	// Safet checks..
	if (!player.isAvailableToConsume()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });
	}

	// Feed the player..
	player.reduceHungerPoints(params.points);

	// Reduce item quantity from inventory..
	player.reduceItem(params.item.data.id, 1);

	// Track on amplitude
	player.createAmplitudeEvent(`Eating food`, { id: 'sandwich', hungerPointsReduced: params.points });

	// @Feature: this allows the player to eat or drink items fast when he's in a hurry without waiting 3 seconds.
	if (!player.isHoldingConsumable() && !player.isDrinking() && !player.isEating()) {
		// Play the right sound
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/items/food/eating.mp3`,
			options: {
				volume: 0.8,
				spatialSound: {
					source: 'position',
					position: player.position,
					maxDistance: 5
				}
			},
			position: player.position,
			isSoundEffect: true,
			range: 5
		});

		// Update status..
		player.updateVars({ isEating: true });

		// Give attachment
		player.giveAttachment('sandwich');

		// Play animation...
		player.applyAnimation({
			dict: 'mp_player_inteat@burger',
			name: 'mp_player_int_eat_burger',
			speed: 1,
			flags: 51,
			duration: 3000,
			onCallback: (player, stopAnim) => {
				// Mark he's not eating anymore..
				player.updateVars({ isEating: false });

				// Stop current anim
				stopAnim();

				// Take away the attachment
				player.removeAttachment('sandwich');
			}
		});
	}
});

mp.events.add(`onDrinkConsumed:water`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`FoodAndDrinks:General`, player.lang);

	// Safet checks..
	if (player.isHoldingConsumable()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	}

	// Safet checks..
	if (!player.isAvailableToConsume()) {
		player.closeInventory();
		return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });
	}

	// Let the player drink..
	player.reduceThirstPoints(params.points);

	// Reduce item quantity from inventory..
	player.reduceItem(params.item.data.id, 1);

	// Track on amplitude
	player.createAmplitudeEvent(`Drinking liquid`, { id: 'water', thirstPointsReduced: params.points });

	// @Feature: this allows the player to eat or drink items fast when he's in a hurry without waiting 3 seconds.
	if (!player.isHoldingConsumable() && !player.isDrinking() && !player.isEating()) {
		// Drinking..
		playRangedAudio({
			sourcePath: `${`__ASSETS__`}/audios/items/drinks/drinking.mp3`,
			options: {
				volume: 0.8,
				spatialSound: {
					source: 'position',
					position: player.position,
					maxDistance: 5
				}
			},
			position: player.position,
			isSoundEffect: true,
			range: 5
		});

		// Update status..
		player.updateVars({ isDrinking: true });

		// Give attachment
		player.giveAttachment('water');

		// Play animation...
		player.applyAnimation({
			dict: 'mp_player_intdrink',
			name: 'loop',
			speed: 1,
			flags: 51,
			duration: 3000,
			onCallback: (player, stopAnim) => {
				// Mark he's not drinking anymore..
				player.updateVars({ isDrinking: false });

				// Stop current anim
				stopAnim();

				// Take away the attachment
				player.removeAttachment('water');
			}
		});
	}
});

// [ ==== BEER ==== ]

mp.events.add(`onDrinkConsumed:beer`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`FoodAndDrinks:General`, player.lang);

	// Hide inventory
	player.closeInventory();

	// Safet checks..
	if (player.isSmoking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('Smoking') });
	if (player.isDrinking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyDrinking') });
	if (player.isEating()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyEating') });
	if (player.isHoldingConsumable()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	if (!player.isAvailableToConsume()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });

	// Update status to let client-side know..
	player.updateVars({ holdConsumable: { active: true, id: 'beer', quantity: 12 } });

	// Play the right sound
	playRangedAudio({
		sourcePath: `${`__ASSETS__`}/audios/items/drinks/openBottle.mp3`,
		options: {
			volume: 0.4,
			spatialSound: {
				source: 'position',
				position: player.position,
				maxDistance: 5
			}
		},
		position: player.position,
		isSoundEffect: true,
		range: 5
	});

	// Show Instructions.
	player.alert({
		type: 'info',
		heading: langGeneral.get('DrinkInstructionsHeading'),
		message: langGeneral.get('DrinkInstructionsMessage')
	});

	// Give attachment
	player.giveAttachment('beer');

	// Hold the beer anim..
	player.applyAnimation({
		dict: 'amb@world_human_drinking@beer@male@base',
		name: 'base',
		speed: 1,
		flags: 50
	});

	// Reduce item quantity from inventory..
	player.reduceItem(params.item.data.id, 1);

	// Track on amplitude
	player.createAmplitudeEvent(`Opened bottle of Beer`);

	return true;
});

mp.events.add(`onItemConsumable:Consume`, async (player: PlayerMp) => {
	// Not holding beer.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'beer')) return false;

	// If we are already drinking... anti spam.
	if (player.isDrinking()) return false;

	// Calculate the total number of sips from this drink left..
	const quantity = player.vars.holdConsumable.quantity - 1;

	// Update var..
	player.updateVars({ isDrinking: true });

	// Drinking..
	playRangedAudio({
		sourcePath: `${`__ASSETS__`}/audios/items/drinks/drinking.mp3`,
		options: {
			volume: 0.5,
			spatialSound: {
				source: 'position',
				position: player.position,
				maxDistance: 5
			}
		},
		position: player.position,
		isSoundEffect: true,
		range: 5
	});

	// Play new anim..
	player.applyAnimation({
		dict: 'amb@world_human_drinking@beer@male@idle_a',
		name: 'idle_c',
		speed: 1,
		flags: 49,
		duration: 5000,
		onCallback: (player, stopAnim) => {
			// Reduce thirst levels..
			player.reduceThirstPoints(0.8); // 10 TP split to 12 max sips.

			// Make drunk
			player.increaseAlcoholLevel(15 / 12); // Total..

			// Throw the bottle away if no sips left..
			if (quantity < 1) return mp.events.call(`onItemConsumable:Stop`, player);

			// Stop current drinking animation and resume holding.
			stopAnim();

			// Update variables
			player.updateVars({ holdConsumable: { ...player.vars.holdConsumable, quantity }, isDrinking: false });

			return true;
		}
	});

	return true;
});

mp.events.add(`onItemConsumable:Stop`, async (player: PlayerMp) => {
	// Not holding beer.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'beer')) return false;

	// Stop all animations
	player.clearAnimations();

	// Remove bottle
	player.removeAttachment('beer');

	// Reset var
	player.updateVars({ holdConsumable: { active: false, id: null, quantity: 0 }, isDrinking: false });

	return true;
});

// [ ==== BEER ==== ]

// [ ==== COFFEE ==== ]

mp.events.add(`onDrinkConsumed:coffee`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`FoodAndDrinks:General`, player.lang);

	// Hide inventory
	player.closeInventory();

	// Safet checks..
	if (player.isSmoking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('Smoking') });
	if (player.isDrinking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyDrinking') });
	if (player.isEating()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyEating') });
	if (player.isHoldingConsumable()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	if (!player.isAvailableToConsume()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });

	// Update status to let client-side know..
	player.updateVars({ holdConsumable: { active: true, id: 'coffee', quantity: 10 } });

	// Show Instructions.
	player.alert({
		type: 'info',
		heading: langGeneral.get('DrinkInstructionsHeading'),
		message: langGeneral.get('DrinkInstructionsMessage')
	});

	// Give attachment
	player.giveAttachment('coffee');

	// Reduce item quantity from inventory..
	player.reduceItem(params.item.data.id, 1);

	// Track on amplitude
	player.createAmplitudeEvent(`Drinking Coffee`);

	// Hold the beer anim..
	player.applyAnimation({
		dict: 'amb@world_human_drinking@coffee@male@base',
		name: 'base',
		speed: 1,
		flags: 50
	});

	return true;
});

mp.events.add(`onItemConsumable:Consume`, async (player: PlayerMp) => {
	// Not holding beer.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'coffee')) return false;

	// If we are already drinking... anti spam.
	if (player.isDrinking()) return false;

	// Calculate the total number of sips from this drink left..
	const quantity = player.vars.holdConsumable.quantity - 1;

	// Update var..
	player.updateVars({ isDrinking: true });

	// Drinking..
	playRangedAudio({
		sourcePath: `${`__ASSETS__`}/audios/items/drinks/sippingCoffee.mp3`,
		options: {
			volume: 1,
			spatialSound: {
				source: 'position',
				position: player.position,
				maxDistance: 5
			}
		},
		position: player.position,
		isSoundEffect: true,
		range: 5
	});

	// Play new anim..
	player.applyAnimation({
		dict: 'amb@world_human_drinking@coffee@male@idle_a',
		name: 'idle_b',
		speed: 1,
		flags: 49,
		duration: 5000,
		onCallback: (player, stopAnim) => {
			// Reduce thirst levels..
			player.reduceThirstPoints(1); // 10 quantity times 10

			// Throw the bottle away if no sips left..
			if (quantity < 1) return mp.events.call(`onItemConsumable:Stop`, player);

			// Stop current drinking animation and resume holding.
			stopAnim();

			// Update variables
			player.updateVars({ holdConsumable: { ...player.vars.holdConsumable, quantity }, isDrinking: false });

			return true;
		}
	});

	return true;
});

mp.events.add(`onItemConsumable:Stop`, async (player: PlayerMp) => {
	// Not holding beer.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'coffee')) return false;

	// Stop all animations
	player.clearAnimations();

	// Remove bottle
	player.removeAttachment('coffee');

	// Reset var
	player.updateVars({ holdConsumable: { active: false, id: null, quantity: 0 }, isDrinking: false });

	return true;
});

// [ ==== COFFEE ==== ]

// [ ==== Cigarette ==== ]

mp.events.add(`onCigaretteUsed`, async (player: PlayerMp, params: UseFoodItemParams) => {
	// Getting lang for errors..
	const langGeneral = getLanguagePack(`Cigarette:General`, player.lang);

	// Hide inventory
	player.closeInventory(); // Close the player's inventory.

	// Safet checks..
	if (player.isSmoking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('Smoking') });
	if (player.isDrinking()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyDrinking') });
	if (player.isEating()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyEating') });
	if (player.isHoldingConsumable()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('AlreadyHolding') });
	if (!player.isAvailableToConsume()) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('ImpossibleToConsume') });

	// Check if the player has a lighter in their inventory.
	const lighter = player.getInventoryItemMatch({ itemId: 13 });
	if (!lighter) return player.alert({ type: 'error', heading: 'Error', message: langGeneral.get('NoLighter') });

	// Update status to let the client-side know..
	player.updateVars({ holdConsumable: { active: true, id: 'cigarette', quantity: 10 } });

	// Play the right sound
	playRangedAudio({
		position: player.position,
		range: 5,
		sourcePath: `${`__ASSETS__`}/audios/systems/smoke/lighting.mp3`,
		isSoundEffect: true,
		options: {
			volume: 0.4
		}
	});

	// Show Instructions.
	player.alert({
		type: 'info',
		heading: langGeneral.get('InstructionsHeading'),
		message: langGeneral.get('InstructionsMessage')
	});

	// Give attachment
	player.giveAttachment('cigarette');

	// Hold the beer anim..
	player.applyAnimation({
		dict: 'amb@code_human_wander_smoking@male@base',
		name: 'static',
		speed: 1,
		flags: 50
	});

	// Check if the quantity of the consumed item is 0 and update the player's inventory accordingly.
	if (params.item.data.meta.quantity - 1 === 0) {
		player.reduceItem(params.item.data.id, 1);
	} else {
		player.updateItem(params.item.data.id, { meta: { quantity: params.item.data.meta.quantity - 1 } });
	}

	// Track the event on amplitude
	player.createAmplitudeEvent(`Smoking a ciggarette`);

	return true;
});

mp.events.add(`onItemConsumable:Consume`, async (player: PlayerMp) => {
	// Not holding a cigarette.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'cigarette')) return false;

	// Calculate the total number of sips from this cigarette left.
	const quantity = player.vars.holdConsumable.quantity - 1;

	// Update variable to indicate that the player is smoking.
	player.updateVars({ isSmoking: true });

	// Play a sound effect for smoking.
	playRangedAudio({
		position: player.position,
		range: 5,
		sourcePath: `${`__ASSETS__`}/audios/systems/smoke/smoking.mp3`,
		isSoundEffect: true,
		options: {
			volume: 0.6
		}
	});

	// Play a new animation for smoking.
	player.applyAnimation({
		dict: 'amb@world_human_smoking@male@male_b@idle_a',
		name: 'idle_a',
		speed: 0.6,
		flags: 49,
		duration: 3000,
		onCallback: (player, stopAnim) => {
			// Throw the cigarette away if no sips left.
			if (quantity < 1) return mp.events.call(`onItemConsumable:Stop`, player);

			// Stop the current smoking animation and resume holding.
			stopAnim();

			// Update variables
			player.updateVars({ holdConsumable: { ...player.vars.holdConsumable, quantity } });

			return true;
		}
	});

	return true;
});

mp.events.add(`onItemConsumable:Stop`, async (player: PlayerMp) => {
	// Not holding a cigarette.
	if (!(player.isHoldingConsumable() && player.getConsumableHold()!.id === 'cigarette')) return false;

	// Stop all animations.
	player.clearAnimations();

	// Remove the cigarette attachment.
	player.removeAttachment('cigarette');

	// Reset variables.
	player.updateVars({ holdConsumable: { active: false, id: null, quantity: 0 }, isSmoking: false });

	return true;
});

// [ ==== Cigarette ==== ]

mp.events.add('playerLoggedInDeath', (player) => {
	// When we die if we hold a consumable we need to stop.
	if (player.isHoldingConsumable()) {
		mp.events.call(`onItemConsumable:Stop`, player);
	}
});
