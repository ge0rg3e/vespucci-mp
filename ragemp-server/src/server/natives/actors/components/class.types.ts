declare global {
	interface Actor {
		// Actor properties
		identifier: string;
		attributes: ActorAttributes;
		info: ActorsInfo;
		entity: PedMp;

		// Functions
		revive: () => void;
		respawn: () => void;
	}

	interface ActorAttributes {
		spawn: { position: Vector3; heading: number };
	}
}

export {};
