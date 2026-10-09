import Actor from './class';
import { createActorParams } from './types';

class Registry {
	private actors: Actor[] = [];

	public create(params: createActorParams) {
		// Extract the actor params
		const { identifier, info = {}, variables = {}, attributes } = params;

		// Create a new actor..
		const actor = new Actor({
			identifier,
			info: {
				createdAt: new Date(),
				name: {
					EN: `Un-named`,
					RO: `Fara Nume`
				},
				level: 1,
				boss: false,
				aggressive: false,
				...(info || {}) // fill if any other added.
			},
			variables: {
				...variables,
				vehicleId: null
			},
			attributes
		});

		// Add it to the array
		this.actors.push(actor);

		// We return the actor entry.
		return actor;
	}

	/**
	 *
	 * @param identifier - The unique identifier of the actor
	 * @returns Actor or null
	 */
	public get(identifier: string) {
		const actor = this.actors.find((actor) => actor.identifier === identifier);
		return actor || null;
	}

	/**
	 *
	 * @returns All actors created on the server
	 */

	public getAll() {
		return this.actors;
	}

	/**
	 *
	 * @param id - the ped id
	 * @returns - the actor entry or null.
	 */

	public getById(id: number) {
		const actor = this.actors.find((actor) => actor.entity.id === id);
		return actor || null;
	}

	/**
	 *
	 * @param identifier - The unique identifier of the actor
	 * @returns boolean
	 */

	public delete(identifier: string) {
		const actor = this.actors.find((actor) => actor.identifier === identifier);
		if (!actor) return false;

		// Delete ped
		actor.entity.destroy();

		// Delete it from db
		const index = this.actors.findIndex((actor) => actor.identifier === identifier);
		if (index === -1) return false;

		this.actors.splice(index, 1);

		return true;
	}

	/**
	 *
	 * @returns The number of actors in total
	 */
	public getSize() {
		return this.actors.length;
	}
}

mp.actors = new Registry();

declare global {
	interface Mp {
		actors: Registry;
	}
}

export {};
