import { createObject, deleteObject } from '@server/natives/objects/components/functions';
import { SpeakerAudio, classPermissionCheckFunc, constructorParameters } from './types';
import { logError } from '@server/utils/helpers';
import { createColshape, deleteColshape } from '@server/natives/colshapes/components/functions';
import { getLanguagePack } from '@vmp/i18n';

export const RANGE_PICKUP_SPEAKER_ITEM = 3;

class Speaker {
	// Identification
	public id: number;
	public owner: constructorParameters['owner'];
	public title;

	// Positioning
	public position: Vector3;
	public rotation: Vector3;
	public dimension: number;

	// The range of this speaker
	public range: number;

	// The music range how far it will play
	public available: boolean = true;
	public permissionChecked: classPermissionCheckFunc = () => true;

	// The object created in-game.
	public object: ObjectMp | undefined;
	public objectType: number;

	// Information about the audio playing.
	public audio: SpeakerAudio | null = null;
	public fallBackAudio: SpeakerAudio | null = null;

	constructor(parameters: constructorParameters) {
		// Set details
		this.position = parameters.position;
		this.rotation = parameters.rotation;
		this.dimension = parameters.dimension;
		this.range = parameters.range;
		this.id = parameters.id;
		this.owner = parameters.owner;
		this.objectType = parameters.objectType;

		// Create the speaker
		this.create();

		// Set the title by default like this.
		this.title = `Bluetooth Speaker (ID: ${this.id})`;
	}

	private async create() {
		try {
			// Create the object
			const objectCreated = await createObject({
				identifier: `speaker@${this.id}`,
				model: mp.joaat(this.getObjectModel()),
				rotation: this.rotation,
				position: this.position,
				dimension: this.dimension,
				alpha: 255,
				vars: {
					disableCollision: true
				}
			});

			// If we failed to create the object
			if (objectCreated === null) throw new Error(`Failed to create speaker object.`);

			// Store it.
			this.object = objectCreated;

			// Create colshape for listening (audio)
			await createColshape({
				identifier: `speaker.listen@${this.id}`,
				position: this.position,
				range: this.range,
				dimension: this.dimension,
				type: 'sphere',
				payload: {
					id: this.id
				}
			});

			// Create colshape for picking up
			await createColshape({
				identifier: `speaker.pickup@${this.id}`,
				position: this.position,
				range: RANGE_PICKUP_SPEAKER_ITEM,
				dimension: this.dimension,
				type: 'sphere',
				payload: {
					id: this.id
				}
			});

			// Create colshape for controlling range
			await createColshape({
				identifier: `speaker.control@${this.id}`,
				position: this.position,
				range: 40,
				dimension: this.dimension,
				type: 'circle',
				payload: {
					id: this.id
				}
			});

			return true;
		} catch (err) {
			await logError(`speakers.class.create`, err);
			return false;
		}
	}

	public destroy(byAdmin = false) {
		// Delete object
		deleteObject(`speaker@${this.id}`);

		// Delete colshape
		deleteColshape(`speaker.listen@${this.id}`);
		deleteColshape(`speaker.pickup@${this.id}`);
		deleteColshape(`speaker.control@${this.id}`);

		// Get all listeners and reset their variable
		this.getListeners().forEach((listener) => {
			// Update their variables
			listener.updateVars({ speakersConnected: listener.vars.speakersConnected.filter((c) => c !== this.id) });

			// Stop the music
			listener.stopAudio(`speaker@${this.id}`);

			// Hide dialog
			if (listener.vars.dialogId?.includes('speakers@')) {
				listener.hidePlayerDialog();
			}
		});

		// Inform the owner that the speaker has been deleted
		if (this.owner.type === 'player') {
			const getOwner = mp.players.at(this.owner.id!);
			if (getOwner) {
				const lang = getLanguagePack('Speakers:Alerts', getOwner.lang);
				getOwner.alert({ type: 'warning', heading: 'Speaker', message: lang.get('Deleted', { byAdmin }) });
			}
		}

		// Reset the controller too
		const controller = this.getController();

		// If there is a controller we remove him and we stop the music.
		if (controller) {
			this.removeController();
		}
	}

	private getObjectModel() {
		if (this.objectType === 1) return `prop_boombox_01`;
		if (this.objectType === 2) return `prop_speaker_01`;
		if (this.objectType === 3) return `prop_speaker_02`;
		if (this.objectType === 4) return `prop_speaker_03`;
		if (this.objectType === 5) return `prop_speaker_04`;
		if (this.objectType === 6) return `prop_speaker_05`;
		if (this.objectType === 7) return `prop_speaker_06`;
		if (this.objectType === 8) return `prop_speaker_07`;
		if (this.objectType === 9) return `prop_speaker_08`;

		// Default
		return 'prop_boombox_01';
	}

	/**
	 * This dictates if someone could connect to this speaker using Vespify Music.
	 * @param status
	 */

	public setAvailabilityStatus(status: boolean) {
		this.available = status;
	}

	/**
	 * Set a custom verification that checks if the player can connect to this speaker.
	 * @param func ( { player, id } ) => true
	 */

	public setPermissionChecked(func: classPermissionCheckFunc) {
		this.permissionChecked = func;
	}

	/**
	 * Check if the player has permission to connect.
	 * @param player
	 * @returns
	 */
	public checkPermissionToConnect(player: PlayerMp) {
		return this.permissionChecked({ player, id: this.id });
	}

	/**
	 * This sets the base audio of the speaker. Is important so the spatial sound task will calculate the volume right.
	 * The volume is calculated like: Get a percent of the base volume. The percent is the User's Bluetooth Speaker audio setting.
	 * @param audio
	 */

	public setAudio(audio: SpeakerAudio | null) {
		this.audio = audio;
	}

	/**
	 * This sets the base audio of the speaker for when there is no controller set. So when a controller disconnects this audio plays automatically to everyone within range.
	 * @param audio
	 */

	public setFallbackAudio(audio: SpeakerAudio | null) {
		this.fallBackAudio = audio;
	}

	public getController() {
		const player = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.vars.speakersControlled.includes(this.id));
		return player || null;
	}

	/**
	 *
	 * Remove the controller and also stop the music for everyone.
	 */

	public removeController() {
		// Mark the connection as now open for connections.
		this.setAvailabilityStatus(true);

		// Get current controller
		const currentController = this.getController();
		if (!currentController) return false;

		// Update his variables
		currentController.updateVars({ speakersControlled: currentController.vars.speakersControlled.filter((c) => c !== this.id) });

		// Update his interface
		currentController.triggerBrowserEvent(`vespify.music@updateSpeakers`, { speakers: currentController.vars.speakersControlled });

		// If there is a fallback audio is now set as main audio
		if (this.fallBackAudio) {
			this.audio = this.fallBackAudio;
		}

		// Stop the music for everyone
		this.getListeners().forEach((listener) => {
			// Stop the music
			listener.stopAudio(`speaker@${this.id}`);

			// If we have fallback audio
			if (this.fallBackAudio) {
				const currentAudio = this.fallBackAudio;

				// Play the new song from the person connected
				listener.playAudio(currentAudio.sourcePath, {
					// Is important so we can stop it
					identifier: `speaker@${this.id}`,
					// The volume of the controller's vespify app music volume.
					volume: currentAudio.volume,
					// If the song is paused we don't auto start it
					autoplay: currentAudio.paused ? false : true,
					// We need to keep them in sync. This sets the song to current song's runtime.
					startTime: 0,
					// And the piece du resistance: Spatial Audio!
					spatialSound: {
						source: 'object',
						identifier: this.object!.id,
						maxDistance: this.range,
						payload: {
							isSpeaker: true
						}
					}
				});
			}
		});

		return true;
	}

	/**
	 * This function will set the player as the new controller.
	 * @param player
	 * @returns
	 */

	public setController(player: PlayerMp) {
		// Update the new controller
		player.updateVars({ speakersControlled: [...player.vars.speakersControlled, this.id] });

		// Update interface too.
		player.triggerBrowserEvent(`vespify.music@updateSpeakers`, { speakers: player.vars.speakersControlled });

		// Set speaker as not available since someone is connected to it
		this.setAvailabilityStatus(false);

		return true;
	}

	/**
	 * Set the name used in the vespify list of devices connected.
	 * @param title
	 */

	public setTitle(title: string) {
		this.title = title;
	}

	/**
	 *
	 * @returns The players listening to this speaker.
	 */

	public getListeners() {
		const listeners = mp.players.toArray().filter((player) => {
			if (!player.vars) return false;
			if (!player.vars.loggedIn) return false;
			if (!player.vars.speakersConnected.includes(this.id)) return false;
			return true;
		});

		return listeners;
	}

	/**
	 * This function will get the current time of the speaker by getting the controller and then
	 * getting the sound's current time.
	 */

	public async getCurrentTime() {
		// Get the controller
		const player = this.getController();

		// If there is audio or is a radio, or there is no player controller.
		if (!this.audio || this.audio!.type === 'radio' || !player) return 0;

		// Invoke the browser to get the audio's current time from vespify music app.
		const currentTime: ExpectedAny = await player.invokeBrowserEvent(`services.audio@getAudioCurrentTime`, { identifier: `vespify.music@phone.vespifyMusic` });

		// Return it.
		return currentTime;
	}
}

export default Speaker;
