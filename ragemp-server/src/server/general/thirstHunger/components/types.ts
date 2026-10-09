declare global {
	interface PlayerVariables {
		// So we can use them client-side..
		hungerPoints: number;
		thirstPoints: number;

		// While doing the item action
		isDrinking: boolean;
		isEating: boolean;
		isSmoking: boolean;

		// Last known message
		lastThirstWarning: Date | null;

		// For client-side to know if they hold something in their hand
		holdConsumable: {
			id: string | null;
			active: boolean;
			quantity: number;
		};
	}
}

export {};
