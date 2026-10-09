import * as rpc from 'rage-rpc';
import { localVoiceRangeDistances } from './definitions';
import { getPlayerVariable } from '@client/utils/helpers';
import { getGameSettings } from '@client/natives/settings';

// Variables
const player = mp.players.local;

/**
 *
 * @param TargetID - The ID of the target player
 * @returns This will ask the server to connect us on world chat. After that we will hear him speaking.
 */

export const addSpeakerOnWorldChat = async (targetId: number) => {
	// Already listening to this player.
	if (isConnectedOnWorldChat(targetId)) return false;

	// Ask the server to connect us.
	await rpc.callServer(`worldChat.addSpeaker`, JSON.stringify({ targetId }));

	return true;
};

/**
 *
 * @param RemoteId - The ID of the target player
 * @returns This will ask the server to disconnect us on world chat. After that we will stop hearing him speaking.
 */

export const removeSpeakerFromWorldChat = async (targetId: number) => {
	// Not listening to him??
	if (!isConnectedOnWorldChat(targetId)) return false;

	// Ask the server to disconnect
	await rpc.callServer(`worldChat.removeSpeaker`, JSON.stringify({ targetId }));

	return true;
};

/**
 *
 * @param id Target ID
 * @returns boolean - Returns true if we are connected on world chat. Aka if he's speaking to us.
 */

export const isConnectedOnWorldChat = (remoteId: number) => {
	try {
		// Get variables
		const targetVoiceChat = getPlayerVariable(remoteId, `voiceChat`);
		if (!targetVoiceChat) return false;

		// Exists line?
		const lineExisting = targetVoiceChat.lines.find((c: ExpectedAny) => {
			return c.playerId === remoteId && c.id == 'worldChat' ? true : false;
		});

		return lineExisting ? true : false;
	} catch (err) {
		throw err;
	}
};

export const getVoiceLinesWithPlayer = (id: number) => {
	try {
		// Get variables
		const localVoiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
		if (!localVoiceChat) return false;

		// Return lines..
		return localVoiceChat.lines.filter((c: ExpectedAny) => {
			return c.playerId === id ? true : false;
		});
	} catch (err) {
		throw err;
	}
};

/**
 *
 * @param type The type of local chat.
 * @param fromLocation Vector3
 * @param toLocation Vector3
 * This will tell us if the distance is too far for us to hear those players.
 */

export const isDistanceTooFar = (type: string, fromLocation: Vector3, toLocation: Vector3) => {
	// If is car mode there is a different check for that
	if (type === 'car') return false;

	// Get their distance..
	const distance = mp.game.gameplay.getDistanceBetweenCoords(fromLocation.x, fromLocation.y, fromLocation.z, toLocation.x, toLocation.y, toLocation.z, true);

	// Is undefined? new type of range for voice chat??
	if (!localVoiceRangeDistances[type]) return true; // BUG!

	// He's too far..
	if (distance > localVoiceRangeDistances[type]) return true;
	return false;
};

export const playersInSameCar = (playerOne: PlayerMp, playerTwo: PlayerMp) => {
	// They are not in any vehicle at all.
	if (!playerOne.vehicle) return false;
	if (!playerTwo.vehicle) return false;

	// They are not in the same vehicle id.
	if (playerOne.vehicle.remoteId !== playerTwo.vehicle.remoteId) return false;

	return true;
};

/**
 *
 * @param distance How far the player is from us.
 * @param maxDistance The max distance they can be away from us.
 * This will tell us how loud the player should be to us, based on their distance from us.
 */

export const calculateVolumeBasedOnDistance = (distance: number, maxDistance: number) => {
	const minDistance = 3; // Minimum distance for lowest volume
	const maxVolume = 1; // Maximum volume
	const minVolume = 0.1; // Lowest volume

	// Calculate the volume based on the distance
	let volume;
	if (distance <= minDistance) {
		// If the distance is less than or equal to the minimum distance,
		// set the volume to the maximum volume
		volume = maxVolume;
	} else if (distance >= maxDistance) {
		// If the distance is between the minimum and maximum distances,
		// calculate the normalized distance between 0 and 1
		volume = minVolume;
	} else {
		// If the distance is between the minimum and maximum distances,
		// calculate the normalized distance between 0 and 1
		const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance);

		// Interpolate the volume between maxVolume and minVolume based on the normalized distance
		// The closer the distance is to the maximum distance, the lower the volume will be
		// The formula used here is linear interpolation
		volume = maxVolume - normalizedDistance * (maxVolume - minVolume);
	}

	return volume;
};

/**
 *
 * @param Volume The current volume number (0.0 - 1.0)
 * @returns Calculates volume as per your game settings. Ex: if you have him at 50% and his volume is 1, is gonna be 0.5.
 */

export const calculateMicrophoneVolume = (volume: number, remoteId: number) => {
	// Getting variables
	const localVoiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
	const targetAccountId = getPlayerVariable(remoteId, `accountId`);

	// Get our settings
	const settings = getGameSettings();
	if (!settings) return 1;

	// If not found..
	if (!localVoiceChat || !targetAccountId) return 1;

	// Do we have a custom volume set for this player in our settings?
	const voiceChatVolume = settings.voiceChat.volume;

	// Calculate the final volume by multiplying the custom volume percentage with the volume based on distance
	const customVolume = voiceChatVolume / 100; // Convert percentage to decimal
	volume = volume * customVolume;

	return volume;
};

/**
 *
 * @param remoteId Player ID
 * @returns The volume number (0.0 - 1.0) calculated for the player accordingly to his distance from you.
 */

export const getWorldChatVolumeForPlayer = (remoteId: number) => {
	try {
		// Get the target..
		const target = mp.players.atRemoteId(remoteId);
		if (!target) return 0;

		// Get our position and the targe tposition
		const fromLocation = player.position;
		const toLocation = target.position;

		// Getting variables
		const targetVoiceChat = getPlayerVariable(remoteId, `voiceChat`);

		// Just in case..
		if (!targetVoiceChat) return 0; // Bug.

		// If we are in the same car we don't need this check.
		if (targetVoiceChat.range === 'car') return 1; // Full.

		// Get their distance so we can adjust it..
		const distance = mp.game.gameplay.getDistanceBetweenCoords(fromLocation.x, fromLocation.y, fromLocation.z, toLocation.x, toLocation.y, toLocation.z, true);

		// Calculate volume based distance + volume set IF any..
		let volume = calculateVolumeBasedOnDistance(distance, localVoiceRangeDistances[targetVoiceChat.range]);

		// Now adjust it to their player volume..
		volume = calculateMicrophoneVolume(volume, remoteId);

		return volume;
	} catch (err) {
		throw err;
	}
};
