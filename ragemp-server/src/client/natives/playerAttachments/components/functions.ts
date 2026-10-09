import { waitForObjectToStreamIn } from '@client/utils/events';
import { Attachments } from './callbacks';
import { logClientsideError } from '@client/general/errors';

const player = mp.players.local;

// @todo: in the future we should stop storing these on target.attachments and just use this array.
export let attachmentObjects: Array<ObjectMp> = [];

/**
 * This function will make sure to create the object and attach it to the synced player.
 * @param plyer The player mp
 * @param identifier The id of the registered attachment
 */

export const createAttachment = async (target: PlayerMp, identifier: string, origin: 'server' | 'client') => {
	try {
		// Get the registered attachment object details
		const entry = Attachments.find((c) => c.id === identifier);

		// If we fail to find the details..
		if (!entry) throw new Error(`Client-side tried to attach an unregistered attachment: ${identifier}`);

		// This model is not in the game at all aka the object won't be created.
		if (!mp.game.streaming.isModelInCdimage(entry.model)) return;

		// Get player position..
		let position = player.position;

		// Just to be safe..
		position.z = position.z + 30;

		// Create the object first.
		const entity = mp.objects.new(entry.model, position, {
			dimension: target.dimension,
			alpha: 0 // it will be created up in air.
		});

		// Make sure it streams in.
		const objectStreamedIn = await waitForObjectToStreamIn(entity.id, false);

		// Set collision to false so we don't harm other vehicles or players with it.
		entity.setCollision(false, true);

		// Failed to stream in after 3 seconds.
		if (objectStreamedIn === false) {
			// Delete the failed object.
			entity.destroy();

			// Throw error.
			throw new Error(`Attachment object created failed to stream in to local player after 10 seconds.`);
		}

		// Add it to the array of objects created so we can disable collision for it
		attachmentObjects.push(entity);

		// Variables
		const off = new mp.Vector3(entry.offset.x, entry.offset.y, entry.offset.z);
		const rot = new mp.Vector3(entry.rotation.x, entry.rotation.y, entry.rotation.z);
		const boneIndex = target.getBoneIndex(entry.boneId);

		// Set the alpha now so we can see it.
		entity.setAlpha(255);

		// Attach it to the player
		entity.attachTo(
			target.handle,
			boneIndex,
			// Offset
			off.x,
			off.y,
			off.z,
			// Rotation
			rot.x,
			rot.y,
			rot.z,
			// Other preferences..
			false,
			false,
			false,
			false,
			2,
			true
		);

		// Create variable if is not existing.
		if (!target.attachments) {
			target.attachments = {};
		}

		// Save it to the player clientsided variable
		target.attachments[identifier] = {
			origin,
			entity
		};
	} catch (error) {
		await logClientsideError('player.createAttachments', error, { origin, identifier });
	}
};

/**
 * This function will delete the attached object from the player.
 * @param target The player
 * @param identifier The id of the attachment
 */

export const removeAttachment = async (target: PlayerMp, identifier: string) => {
	try {
		// We don't have any attachment created for this one.
		if (!target.attachments) throw new Error(`This player didn't had any attachment.`);
		if (!target.attachments[identifier]) throw new Error(`This player didn't had this attachment: ${identifier}`);

		// Get the object.
		const attachment = target.attachments[identifier];

		if (!mp.objects.exists(attachment.entity)) throw new Error(`Tried to destroy an object that didn't exist.`);

		// Remove it from the array of objects
		attachmentObjects = attachmentObjects.filter((c) => c.id !== attachment.entity.id);

		// Delete the object
		attachment.entity.destroy();

		// Delete the property
		delete target.attachments[identifier];
	} catch (error) {
		await logClientsideError('player.removeAttachment', error, { identifier });
	}
};

/**
 * A simple check if a target (player) has a certain attachment already.
 * @param target
 * @param identifier
 * @returns boolean
 */

export const checkAttachmentExists = (target: PlayerMp, identifier: string) => {
	try {
		// We don't have any attachment created for this one.
		if (!target.attachments || !target.attachments[identifier]) return false;

		return true;
	} catch (err) {
		logClientsideError(`playerAttachments.checkAttachmentExists`, err);
		return false;
	}
};
