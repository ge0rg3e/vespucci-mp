import { BusinessTypes, businessTypes } from '@server/definitions/businessTypes';
import { formatNumber } from '@server/utils/helpers';
import { Businesses } from './core';

mp.events.add('loadPlayerDefaults', (player) => {
	// Update this variable
	player.updateVars({ businessUsed: null });

	// Load business dependencies...
	Businesses.forEach((b) => {
		// Load the business dependencies..
		mp.events.call(`businesses:loadDependencies`, player, b);
	});
});

mp.events.add('business:callToActions.load', (player, business) => {
	// Go through all call to actions and load them.
	business.locations.callToActions.forEach((action) => {
		// Creating the colshape
		player.createColshape({
			type: 'sphere',
			identifier: `BusinessCallAction:${action.id}:${business.id}`,
			position: action.coords,
			range: action.options.colshapeRadius || 1.5,
			dimension: 0,
			payload: {
				businessId: business.id,
				actionId: action.id,
				businessType: business.type
			}
		});

		// Creating the markers..
		if (!action.options.marker?.disabled) {
			const loc = action.coords;
			const radius = action.options.marker?.radius || 0.9;
			const markerAnchorZ = action.options.marker?.zNegative || 1.1;
			const markerColor = action.options.marker?.color || [255, 165, 0, 80];

			player.createMarker({
				identifier: `BusinessCallAction1:${action.id}:${business.id}`,
				type: 1,
				position: new mp.Vector3(loc.x, loc.y, loc.z - markerAnchorZ),
				scale: radius,
				direction: new mp.Vector3(0, 0, 0),
				rotation: new mp.Vector3(0, 0, 0),
				color: markerColor,
				dimension: 0
			});

			if (action.options.marker?.iconMarkerId) {
				player.createMarker({
					identifier: `BusinessCallAction2:${action.id}:${business.id}`,
					type: action.options.marker?.iconMarkerId,
					position: new mp.Vector3(loc.x, loc.y, loc.z - 0.5),
					scale: 0.9,
					rotation: new mp.Vector3(0, 0, 0),
					direction: new mp.Vector3(0, 0, 0),
					color: [255, 165, 0, 120],
					dimension: 0
				});
			}
		}
	});
});

mp.events.add('business:callToActions.remove', (player, business) => {
	business.locations.callToActions.forEach((action) => {
		// Markers..
		player.deleteMarker(`BusinessCallAction1:${action.id}:${business.id}`);
		player.deleteMarker(`BusinessCallAction2:${action.id}:${business.id}`);

		// Colshape
		player.deleteColshape(`BusinessCallAction:${action.id}:${business.id}`);
	});
});

mp.events.add('business:safezone.load', (player, business) => {
	business.configs.safezones!.forEach((safezone, ix) => {
		player.createColshape({
			type: 'circle',
			identifier: `safezone:BusinessSafeZone:${business.id}:${ix}`,
			position: new mp.Vector3(safezone.coords.x, safezone.coords.y, safezone.coords.z),
			range: safezone.radius,
			dimension: 0
		});
	});
});

mp.events.add('business:safezone.delete', (player, business) => {
	business.configs.safezones!.forEach((_, ix) => {
		player.deleteColshape(`safezone:BusinessSafeZone:${business.id}:${ix}`);
	});
});

mp.events.add('business:buyPoint.load', (player, business) => {
	const bType: BusinessTypes = businessTypes.find((type: BusinessTypes) => type.id === business.type)!;

	let text3D = ``;
	if (business.owned === false) {
		text3D = `~o~Business ${business.id}~n~${bType.label}~n~Available for purchase~n~Required Level: ${business.level}~n~Price: ${formatNumber(business.price, true)}`;
	} else {
		text3D = `~o~Business ${business.id}~n~${bType.label}~n~Business owned by ${business.ownerName}~n~Required Level: ${business.level}`;
	}

	// Create buypoint
	const buyPoint = business.locations.buyPoint;

	player.create3DTextLabel({
		identifier: `Business_BuyPoint:${business.id}`,
		text: text3D,
		position: new mp.Vector3(buyPoint.x, buyPoint.y, buyPoint.z + 0.7)
	});

	player.createMarker({
		identifier: `Business_BuyPoint:${business.id}`,
		type: 1,
		position: new mp.Vector3(buyPoint.x, buyPoint.y, buyPoint.z - 1.1),
		scale: 0.9,
		color: [255, 165, 0, 80]
	});

	player.createMarker({
		identifier: `Business_BuyPoint2:${business.id}`,
		type: 29,
		position: new mp.Vector3(buyPoint.x, buyPoint.y, buyPoint.z - 0.5),
		scale: 0.9,
		color: [255, 165, 0, 120]
	});
});

mp.events.add('business:buyPoint.delete', (player, business) => {
	// Buypoint
	player.delete3DTextLabel(`Business_BuyPoint:${business.id}`);
	player.deleteMarker(`Business_BuyPoint:${business.id}`);
	player.deleteMarker(`Business_BuyPoint2:${business.id}`);
});

mp.events.add('business:blip.load', (player, business) => {
	const bType: BusinessTypes = businessTypes.find((type: BusinessTypes) => type.id === business.type)!;

	// If business needs the blip in a different place
	const blipLocation = business.locations.blip ? business.locations.blip : business.locations.buyPoint;

	player.createBlip({
		identifier: `BusinessBlip:${business.id}`,
		type: business.configs.blipIcon ? business.configs.blipIcon : bType.blip,
		position: new mp.Vector3(blipLocation.x, blipLocation.y, blipLocation.z),
		label: `${business.configs.mapLabel ? business.configs.mapLabel : bType.label}`,
		color: bType.blipColor ? bType.blipColor : 17,
		shortRange: true
	});
});

mp.events.add('business:blip.delete', (player, business) => {
	// Blip for where to find the business
	player.deleteBlip(`BusinessBlip:${business.id}`);
});

mp.events.add('business:actors.load', (business) => {
	const actors = business.locations.actors || [];

	// console.log('actors', actors);
	actors.forEach((actor) => {
		// Extract these..
		const { attributes, identifier } = actor;

		mp.actors.create({
			identifier: `business_${business.id}_${identifier}`,
			attributes: {
				model: attributes.model,
				position: new mp.Vector3(attributes.coords.x, attributes.coords.y, attributes.coords.z),
				heading: attributes.heading,
				invincible: attributes.invincible || false,
				frozen: attributes.frozen || false
			},
			info: {
				business: {
					id: business.id
				},
				name: {
					EN: attributes.name !== undefined ? attributes.name : `Business NPC`,
					RO: attributes.name !== undefined ? attributes.name : `Business NPC`
				},
				level: 99
			},
			variables: {}
		});
	});
});

mp.events.add('business:actors.delete', (business) => {
	// Get all actors linked to this business.
	const actors = mp.actors.getAll().filter((actor) => actor.info?.business && actor.info.business.id === business.id);

	// Delete all of them..
	actors.forEach((actor) => mp.actors.delete(actor.identifier));
});
