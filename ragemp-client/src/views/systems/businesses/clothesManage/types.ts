declare global {
	interface Clothes {
		id: number;
		drawableId: number;
		textureId: number;
		name: string;
		type: string;
		gender: string;
		category: string;
		price: number;
		bcPrice: number;
		minimumDonorTier: number;
		isAvailable: boolean;
		isAddon: boolean;
		dlcName: string;
		createdAt: string;
		updatedAt: string;
		meta: {
			undershirtCompatible?: boolean;
			torsoRecommended?: number;
		};
	}
}

export {};
