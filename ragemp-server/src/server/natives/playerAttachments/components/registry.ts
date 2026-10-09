import { red } from 'colorette';

class Registry {
	private attachments: PlayerAttachments[] = [];

	public register(id: RegisteredPlayerAttachmentIds, model: HashOrNumberOrString<string>, boneId: number, offset: Vector3, rotation: Vector3) {
		// If it already exists..
		if (this.attachments.find((c) => c.id === id)) {
			console.error(`${red('[ERROR]')} Player attachment with this id already exists: ${id}`);
			process.exit(1);
		}

		// Add it to attachm,ents
		this.attachments.push({
			id,
			boneId,
			offset,
			rotation,
			model: typeof model === 'string' ? mp.joaat(model) : model
		});
	}

	/**
	 *
	 * @returns All registered attachments possible on the server
	 */

	public getAll() {
		return this.attachments;
	}

	/**
	 *
	 * @param id - the attachment registry id
	 * @returns - the entry or null.
	 */

	public getById(id: string) {
		const elm = this.attachments.find((a) => a.id === id);
		return elm || null;
	}

	/**
	 *
	 * @returns The number of actors in total
	 */
	public getSize() {
		return this.attachments.length;
	}
}

mp.playerAttachments = new Registry();

declare global {
	interface Mp {
		playerAttachments: Registry;
	}
}

export {};
