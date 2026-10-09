import { logError } from '@/utils/helpers';
import { dispatchAudioEvent } from '../utils/functions';
import { AudioClassParams, BiquadFilterParams, primaryNodeIdTitles } from '../utils/types';

class AudioClassController {
	// Details
	private identifier: string;
	private audioContext: AudioContext;
	private audioUrl: string;

	// Controls
	private volume = 1;
	private loop = false;
	private autoplay = false;
	private muted = false;

	public pan = 0;
	public biquadFilter: BiquadFilterParams | undefined;
	private primaryNodeId: primaryNodeIdTitles = 'gain';
	private startTime: number | undefined;

	// Public accessibles
	public audioNode: MediaElementAudioSourceNode | null = null;
	public audioElement: HTMLAudioElement | null = null;
	public gainNode: GainNode | undefined;
	public panNode: StereoPannerNode | undefined;
	public biquadNode: BiquadFilterNode | undefined;
	public buffer: AudioBuffer | null = null;

	constructor(params: AudioClassParams) {
		// Save the audio reference
		this.audioContext = params.audioContext;

		// Save identifier
		this.identifier = params.identifier;

		// Save url
		this.audioUrl = params.audioUrl;

		// Setting preferences default
		this.loop = params.loop || false;
		this.autoplay = params.autoplay || false;
		this.volume = params.volume !== undefined ? params.volume : 1;
		this.pan = params.pan || 0;
		this.biquadFilter = params.biquadFilter || undefined;
		this.startTime = params.startTime || undefined;
		this.muted = params.muted || false;

		// Create the audio in context.
		this.create();
	}

	public create() {
		try {
			// Create audio element
			this.audioElement = new Audio(this.audioUrl!);

			// Two one-time events needed.
			this.audioElement.addEventListener('loadeddata', () => {
				dispatchAudioEvent(this.identifier, 'loaded');

				// If we have a preferred start time
				if (this.startTime) {
					this.setCurrentTime(this.startTime);
				}
			});

			this.audioElement.addEventListener('error', () => dispatchAudioEvent(this.identifier, 'failedToLoad'));

			// @Bugfix: Radios will have CORS Errors..
			this.audioElement.crossOrigin = 'anonymous';

			// Set autoplay
			this.audioElement.autoplay = this.autoplay;

			// Set muted
			this.audioElement.muted = this.muted;

			// Creat esource node
			this.audioNode = this.audioContext.createMediaElementSource(this.audioElement);

			// Create a gain node for controlling the volume
			this.gainNode = this.audioContext.createGain();
			this.gainNode.gain.value = this.volume;

			// Connect the audio source to the gain node. (So volume will be routed through gain node)
			this.audioNode.connect(this.gainNode);

			// Connect the pan node to the destination (e.g., speakers)
			this.gainNode.connect(this.audioContext.destination);

			// If they use a special effect on the audio.
			// @Reminder: As of right now it works just one effect at a time.
			if (this.pan !== 0) {
				this.setPan(this.pan);
			} else if (this.biquadFilter) {
				this.setBiquadFilter(this.biquadFilter);
			}

			// If we're supposed to loop
			this.audioElement.loop = this.loop;

			return true;
		} catch (err) {
			logError(`services.audio.class.play`, err);
			return false;
		}
	}

	public destroy() {
		// You can't destroy what is not created yet.
		if (!this.audioNode) return false;

		// Stop audio
		if (this.audioElement) {
			this.audioElement!.pause();
		}

		// We need to disconnect this to save memory ram.
		this.audioNode.disconnect();
		this.gainNode!.disconnect();

		if (this.panNode) {
			this.panNode.disconnect();
		}

		if (this.biquadNode) {
			this.biquadNode.disconnect();
		}
	}

	public play() {
		if (!this.audioElement) return false;
		this.audioElement!.play();
	}

	public pause() {
		if (!this.audioElement) return false;
		this.audioElement!.pause();
	}

	public setMuted(state: boolean) {
		if (!this.audioElement) return false;
		this.audioElement.muted = state;
	}

	/**
	 * Sets the volume
	 * @param value number 0-1. (0.1 = 10%) so set it like 0.1 for 10% or 1 for 100%
	 */

	public setVolume(value: number) {
		// Save the value
		this.volume = value;

		// Save it in gain node (if is created) - we can set volume while paused.
		if (this.gainNode) {
			this.gainNode.gain.value = value;
		}
	}

	/**
	 * Sets the current time
	 * @param value seconds
	 */

	public setCurrentTime(value: number) {
		if (!this.audioElement) return false;
		this.audioElement.currentTime = value;
	}

	/**
	 * Sets the sound to loop or not.
	 * @param value - boolean
	 */

	public setLooping(value: boolean) {
		// Set value
		this.loop = value;

		// If song is playing..
		if (this.audioElement) {
			this.audioElement.loop = value;
		}
	}

	/**
	 *
	 * @returns The song's duration.
	 */

	public getDuration() {
		if (!this.audioElement) return 0;
		return this.audioElement?.duration;
	}

	/**
	 *
	 * @returns The song's duration.
	 */

	public getCurrentTime() {
		if (!this.audioElement) return 0;
		return this.audioElement?.currentTime;
	}

	/**
	 * Resets the node that is connnected to the speaker.
	 */

	private resetSpeakerNode = () => {
		let title: primaryNodeIdTitles;
		let node: ExpectedAny = null;

		if (this.panNode) {
			node = this.panNode;
			title = 'pan';
		} else if (this.biquadFilter) {
			node = this.biquadFilter;
			title = 'biquad';
		} else {
			node = this.gainNode;
			title = 'gain';
		}

		// Set the new one..
		this.setSpeakerNode(title, node);
	};

	/**
	 * Sets this node as the one connected to the speaker (destination)
	 * As of right now this is what I know: In order for audio effects to function they must be the primary audio nodes.
	 */

	private setSpeakerNode = (title: primaryNodeIdTitles, node: GainNode | StereoPannerNode | BiquadFilterNode) => {
		// If the new node is not the volume node we need to connect volume gain to it so it's applied.
		if (title !== 'gain') {
			// We disconnect the gain node (volume node) from the speakers first.
			this.gainNode!.disconnect();

			// We connect volume node to this new node.
			this.gainNode!.connect(node);
		}

		// We now connect this new node to speakers.
		node.connect(this.audioContext.destination);

		// Save the reference
		this.primaryNodeId = title;
	};

	/**
	 * Sets the 3D Direction of Sound
	 * @param value A number like -1 means Left side, 0 means centered, 1 means right side.
	 */

	public setPan(value: number) {
		// Save the value
		this.pan = value;

		// If pan value is zero (centered) we should destroy it.
		if (this.pan === 0 && this.panNode) {
			// Destroy the pan node to save memory.
			this.panNode!.disconnect();
			this.panNode = undefined; // Set it to undefined.

			// If the primary audio node is now removed we must reset it.
			if (this.primaryNodeId === 'pan') {
				this.resetSpeakerNode();
			}

			return true;
		}

		// If pan node is not present..
		if (!this.panNode) {
			this.panNode = this.audioContext.createStereoPanner();
		}

		// Applying preferences
		this.panNode.pan.value = value;

		// @Reminder: I tried to do a check if primary node is gain then set is a primary speaker node if not connect to speaker node
		// But it seems only one effect can be used at a time.

		// In order for this audio effect to take part we need to set pan as the new speaker node.
		this.setSpeakerNode('pan', this.panNode!);
	}

	/**
	 * Sets biquad filter effects.
	 * @param params A set of filter params.
	 */

	public setBiquadFilter(params: BiquadFilterParams | null) {
		// If we want to disable it
		if (params === null) {
			if (this.biquadNode) {
				// Disconnect and delete
				this.biquadNode?.disconnect();
				this.biquadNode = undefined; // Delete.

				// If the primary audio node is now removed we must reset it.
				if (this.primaryNodeId === 'biquad') {
					this.resetSpeakerNode();
				}
			}

			return true;
		}

		// If the node is not created
		if (!this.biquadNode) {
			this.biquadNode = this.audioContext.createBiquadFilter();
		}

		//Applying preferences
		this.biquadNode!.type = params!.type;
		this.biquadNode!.frequency.value = params.frequency !== undefined ? params.frequency : 350; // default value is 350
		this.biquadNode!.Q.value = params.qFactor !== undefined ? params.qFactor : 1;
		this.biquadNode!.gain.value = params.gain !== undefined ? params.gain : 0;

		// In order for this audio effect to take part we need to set biquad as the new speaker node.
		this.setSpeakerNode('biquad', this.biquadNode!);
	}
}

export default AudioClassController;
