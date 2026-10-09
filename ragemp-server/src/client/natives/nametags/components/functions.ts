import { isAttackedByPlayer, isAttackingPlayer } from '@client/general/damageLog';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables that are needed in more than one function.
const nameTagLineHeight = 0.0211;
const player = mp.players.local;
/**
 *
 * @param x 2d screen x
 * @param y 2d screen x
 * @param barValue how much (out of 100) the hp is.
 * @param colorValue the rgba color for the filled in
 * @returns This function will draw a HP Bar at a 2d screen position.
 */

// @Ideas for the future in case current imeplementation does not work:
// Draw grey background, leave padding 1px (equivalent) draw black background inside it, draw value background inside it then. Voila. Bg with border effect.

export const drawValueBar = (x: number, y: number, barValue: number, colorValue: Array<number>) => {
	// Appearance of this bar.
	const width = 0.04;
	const height = 0.0062;

	// Calculate the width of the health bar based on the health value.
	const valueWidth = (width / 100) * barValue;

	// Calculate the x-coordinate for the health bar based on the health value so it will start drawing from the left side.
	const valueLeftX = x - width / 2 + valueWidth / 2;

	// Draw the health bar
	mp.game.graphics.drawRect(x, y, width, height, 0, 0, 0, 80, false); // Background
	mp.game.graphics.drawRect(valueLeftX, y, valueWidth, height, colorValue[0], colorValue[1], colorValue[2], colorValue[3], false); // HP Value

	// Border
	const borderWidth = 0.0008;
	const borderColor = [0, 0, 0, 180];

	// Define the border edges
	const borderEdges = [
		// LEFT AND RIGHT
		{ x: x - width / 2, y: y, w: borderWidth, h: height }, // Left border
		{ x: x + width / 2, y: y, w: borderWidth, h: height }, // Right border
		// TOP AND BOTTOM.
		{ x: x, y: y - height / 2, w: width + borderWidth, h: borderWidth * 2 }, // Top border
		{ x: x, y: y + height / 2, w: width + borderWidth, h: borderWidth * 2 } // Bottom border
	];

	// Draw the border edges
	borderEdges.forEach((edge) => {
		// Shortcut
		const bc = borderColor;

		// Draw the border now..
		mp.game.graphics.drawRect(edge.x, edge.y, edge.w, edge.h, bc[0], bc[1], bc[2], bc[3], false);
	});

	// Return the Y position where the bar ends
	return y - height;
};

export const getPlayerSprites = (remoteId: number) => {
	const sprites = [];

	// Get variables dependencies
	const voiceChat = getPlayerVariable(remoteId, `voiceChat`);
	const settings = getPlayerVariable(remoteId, 'settings');
	if (!settings) return [];

	// @TBD: Sprites pt chat opened, inventory opened, phone opened.

	if (voiceChat && voiceChat.active === true) {
		sprites.push({
			textureDict: 'mpleaderboard',
			textureName: 'leaderboard_audio_3',
			width: 0.012,
			height: 0.0216,
			color: [147, 191, 255, 255]
		});
	}

	if (voiceChat && settings.voiceChat.enabled === false) {
		sprites.push({
			textureDict: 'mpleaderboard',
			textureName: 'leaderboard_audio_mute',
			width: 0.014,
			height: 0.0218,
			color: [147, 191, 255, 255]
		});
	}

	return sprites;
};

export const drawSprites = (sprites: ExpectedAny, x: number, y: number) => {
	// Variables required for this function.
	const spacingBetweenSprites = 0.002;
	const spriteWidth = 0.008; // We shouldn't use sprite.width because even those is 0.12 it's more like an 0.8 , is like object-fit: contain.

	// Calculate the negative margin to make a marign: 0 auto equivalent to center the sprites.
	let totalWidth = 0;

	sprites.forEach((_: ExpectedAny) => {
		if (sprites.length === 1) return false;

		// Add to the negative..
		totalWidth += spriteWidth + spacingBetweenSprites;

		return true;
	});

	// Calculate the starting X position to center the sprites
	let startX = x - totalWidth / 2;

	// Iterate over each sprite
	sprites.forEach((sprite: ExpectedAny) => {
		// Do we have texture loaded?
		if (mp.game.graphics.hasStreamedTextureDictLoaded(sprite.textureDict) !== true) {
			mp.game.graphics.requestStreamedTextureDict(sprite.textureDict, true);
		}

		// Prepare the entry object with sprite information
		const entry = {
			textureDict: sprite.textureDict,
			textureName: sprite.textureName,
			screenX: startX,
			screenY: y,
			width: sprite.width,
			height: sprite.height,
			heading: 0,
			red: sprite.color[0],
			green: sprite.color[1],
			blue: sprite.color[2],
			alpha: sprite.color[3],
			p9: true
		};

		// Draw the sprite using the entry information
		mp.game.graphics.drawSprite(
			entry.textureDict,
			entry.textureName,
			entry.screenX,
			entry.screenY,
			entry.width,
			entry.height,
			entry.heading,
			entry.red,
			entry.green,
			entry.blue,
			entry.alpha,
			entry.p9
		);

		// Update the X position for the next sprite
		startX += sprite.width + spacingBetweenSprites; // Add a small gap between sprites
	});

	// Return the final X position
	return startX;
};

/**
 *
 * @param groupsString The string of groups
 * @returns The title if there's any.
 */

export const getPlayerTitle = (groupsString: string) => {
	const isAdmin = groupsString.includes('admins') ? true : false;
	const isDeveloper = groupsString.includes('developers') ? true : false;

	let rankText = null;

	if (isAdmin) {
		rankText = `~r~« Administrator »~s~`;
	} else if (isDeveloper) {
		rankText = `~o~« Server Developer »~s~`;
	}

	return rankText;
};

/**
 *
 * @param variables The player's variables
 * @returns The text string that must be render for the player's nametag.
 */

export const getPlayerNametagTexts = (remoteId: number) => {
	try {
		// Variable that will hold them all
		let nametags = [];

		// Get dependencies variables
		const groups = getPlayerVariable(remoteId, `groups`);
		const level = getPlayerVariable(remoteId, `level`);
		const username = getPlayerVariable(remoteId, `username`);
		const accountId = getPlayerVariable(remoteId, `accountId`);
		const awayFromKeyboard = getPlayerVariable(remoteId, `awayFromKeyboard`);

		// Get his title
		const title = getPlayerTitle(groups);

		// If there's a nametag toa dd.
		if (title) {
			nametags.push(title);
		}

		// Their normal name
		nametags.push(`~y~Lvl. ${level}~s~ <C>${username}</C>`);

		// Get his AFK Stats
		const afkStats = awayFromKeyboard;

		if (afkStats && afkStats.enabled === true && afkStats.seconds >= 30) {
			nametags.push(`~HUD_COLOUR_GREYLIGHT~Away from keyboard~s~`);
		}

		nametags.push(`~HUD_COLOUR_NET_PLAYER32~<C>#${accountId}</C>~s~`);

		return nametags;
	} catch (err) {
		throw err;
	}
};

/**
 * This function calculates the exact x, y on your 2d Screen where the nametag should be.
 */

export const getNametagCoords = (target: PlayerMp | PedMp, nametags: Array<string>) => {
	try {
		// Variables
		const nameTagTextOffset = nametags.length * (nameTagLineHeight + 0.012); // Calculate the additional offset based on the number of newlines. -- More text -- nametag goes up.
		const spriteOffset = 0.028; // We push the nametags a bit above when this happens.

		// Get his head's coords.
		const headCoords = target.getBoneCoords(31086, 0, 0, 0); // get head coords of the correct bone id.
		if (!headCoords) return null; // Means there's something weird there.

		// The 3D Coords where the right position for the nametag should be.
		let gameCoords = new mp.Vector3(headCoords.x, headCoords.y, headCoords.z);

		// Calculate the final offset required from the body's head  to the nametag. (a space between the head and the nametag)
		const spaceBetweenHeadAndNametag = 0.33 + nameTagTextOffset;

		// the final 2d Screen coords
		let screenCoords = mp.game.graphics.world3dToScreen2d(new mp.Vector3(gameCoords.x, gameCoords.y, gameCoords.z + spaceBetweenHeadAndNametag));
		if (!screenCoords) return null; // Not on our screen or some weird ass ragemp bug.

		// @Bugfix: screenCords return is a read only forced object that cannot be edited??
		const coords = { x: screenCoords.x, y: screenCoords.y };

		// Add space for the sprites.
		coords.y -= spriteOffset;

		return coords;
	} catch (err) {
		throw err;
	}
};

export const drawNameTags = (nametags: Array<string>, coords: ExpectedAny) => {
	let lastY = coords.y;

	// Draw each nametag on its individual row to avoid hitting the 90 char limit
	nametags.forEach((text, ix) => {
		const y = coords.y + ix * nameTagLineHeight; // Decrease Y position for each iteration

		lastY = y;
		// Draw the player nametag text.
		mp.game.graphics.drawText(text, [coords.x, y], {
			font: 4, // 4 is cute
			color: [255, 255, 255, 223],
			scale: [0.33, 0.33],
			outline: true,
			centre: true
		});
	});

	const drawableLastY = lastY + nameTagLineHeight + 0.005; // last number is just a number representing the height of the text.

	return drawableLastY;
};

/**
 *
 * @param target PedMP or Player
 * @returns True if we should see his health bar.
 */

export const shouldSeeHealthBar = (type: 'actor' | 'player', target: PedMp | PlayerMp) => {
	let response = false;

	// If we're aiming at him.
	if (mp.game.player.isFreeAimingAtEntity(target.handle)) {
		response = true;
	}

	// If he attacked us or we attacked him (PED)
	if (type === 'actor' && (target.hasBeenDamagedBy(player.handle, true) || player.hasBeenDamagedBy(target.handle, true))) {
		response = true;
	}

	// If he attacked us or we attacked him (Player
	if (type === 'player' && (isAttackedByPlayer(target.remoteId) || isAttackingPlayer(target.remoteId))) {
		response = true;
	}

	return response;
};

/**
 *
 * @param data The actor's data
 * @returns The text string that must be render for the player's nametag.
 */

export const getActorNameTagTexts = (data: ExpectedAny) => {
	try {
		// Variable that will hold them all
		let nametags = [];

		// Get local language
		const localLanguage = getPlayerVariable(player.remoteId, `language`);
		if (!localLanguage) return []; // bug.

		const actorName = data.info.name[localLanguage];

		// The name and level
		nametags.push(`~HUD_COLOUR_BLUELIGHT~Lvl. ${data.info.level} ~HUD_COLOUR_GREYLIGHT~<C>${actorName}</C>`);

		return nametags;
	} catch (err) {
		throw err;
	}
};

export const getActorSprites = (data: ExpectedAny) => {
	try {
		// Variable that will hold them all
		let sprites = [];

		// //target
		// sprites.push({
		// 	textureDict: 'mpinventory',
		// 	textureName: 'shooting_range',
		// 	width: 0.012,
		// 	height: 0.0216,
		// 	color: [183, 94, 94, 255]
		// });

		// // Has weapon?
		// sprites.push({
		// 	textureDict: 'mpinventory',
		// 	textureName: 'mp_specitem_weapons',
		// 	width: 0.012,
		// 	height: 0.0216,
		// 	color: [222, 180, 96, 255]
		// });

		// // Has drugs?
		// sprites.push({
		// 	textureDict: 'mpinventory',
		// 	textureName: 'mp_specitem_weed',
		// 	width: 0.012,
		// 	height: 0.0216,
		// 	color: [98, 178, 116, 255]
		// });

		// // Boss
		// sprites.push({
		// 	textureDict: 'mpinventory',
		// 	textureName: 'deathmatch',
		// 	width: 0.012,
		// 	height: 0.0216,
		// 	color: [233, 74, 74, 255]
		// });

		// Is a business linked NPC.
		if (data.info.business !== undefined) {
			sprites.push({
				textureDict: 'mpinventory',
				textureName: 'mp_specitem_package',
				width: 0.012,
				height: 0.0216,
				color: [255, 128, 0, 255]
			});
		}

		return sprites;
	} catch (err) {
		throw err;
	}
};
