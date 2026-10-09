declare global {
	interface PlayerVariables {
		godmode: boolean;
		ownTimeOfDay: number | null;
		ownWeather: string | null;
		isInGhostmode: boolean;
		lastRecoverablePosition: Vector3;
	}

	interface PlayerMeta {
		waypointMarked: {
			x: number;
			y: number;
			z: number;
		} | null;
		marks: Record<string, ExpectedAny>;
		waypointTeleportation: boolean;
	}
}

export {};
