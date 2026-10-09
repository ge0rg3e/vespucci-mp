import { DealershipAttributes } from '@modules/database/game/dealerships/model/types';
import { DealershipStocksAttributes } from '@modules/database/game/dealershipStocks/model/types';

declare global {
	interface Dealership extends Omit<DealershipAttributes, 'coords'> {
		coords: Vector3;
		stocks: Array<DealershipStock>;
	}

	interface DealershipStock extends DealershipStocksAttributes {
		id: number; // put here so I could create it.
	}
	interface PlayerVariables {
		dealershipId: number | null;
		isTestDrivingInDealership: boolean;
	}
}

export {};
