import { ClothesAttributes } from '@modules/database/natives/clothes/model/types';

declare global {
	interface Clothes extends Omit<ClothesAttributes, 'meta'> {
		id: number;
		meta: {
			undershirtCompatible?: boolean;
			torsoRecommended?: number;
		};
	}
}

export {};
