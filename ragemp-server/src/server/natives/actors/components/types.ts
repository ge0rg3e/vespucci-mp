// Typescript

import { Languages } from '@vmp/i18n';

declare global {
	interface ActorMp {
		identifier: string;
		entity: PedMp;
		attributes: Partial<ActorAttributes>;
		info: ActorsInfo;
		variables: ActorVariables;
	}

	interface ActorVariables {
		vehicleId: null | number /* The vehicle he's driving */;
	}

	interface ActorsInfo {
		createdAt?: Date;
		vehicleId?: number;
		name: Languages;
		level: number;
		aggressive: boolean;
		boss: boolean;
	}

	// Creating this here..
	interface ActorAttributes extends BasicActorAttributes {}
}

interface BasicActorAttributes {
	// Appearance
	model: string;

	// Position and dimension..
	position: Vector3;
	heading?: number;
	dimension?: number;

	// RAGE:MP Native
	dynamic?: boolean /* Necesar pentru streaming */;
	invincible: boolean /* Daca NPC-ul poate sa moara */;
	frozen: boolean /* Daca NPC-ul sa se poata misca din loc, reactiona gen sa se sperie si sa fuga.  */;
}

type PartialActorsInfo = Omit<Partial<ActorsInfo>, 'name'> & { name: Languages };

export type createActorParams = {
	identifier: string;
	attributes: BasicActorAttributes;
	variables: Partial<ActorVariables>;
	info: PartialActorsInfo;
};
export {};
