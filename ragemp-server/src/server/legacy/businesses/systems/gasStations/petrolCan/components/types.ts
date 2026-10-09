declare global {
	interface PlayerVariables {
		petrolCan: {
			status: 'refilling' | 'using' | 'idle' | null;
			litres: number /** How many litres the petrol can has in it. */;
			inventoryItemId: string | null;
			vehicleId?: number;
		};
	}
}

export {};
