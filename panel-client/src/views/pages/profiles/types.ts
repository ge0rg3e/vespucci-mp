export interface Props {
	data: {
		username: string;
		level: number;
		experience: number;
		connectedTime: number;
		isOnline: boolean;
		money: number;
		house: number;
		business: number;
		groups: string;
		donorTier: number;
		Vehicles: Array<{
			id: number;
			status: number;
			model: string;
			plate: string;
			odometer: number;
			tunning: string;
			createdAt: Date;
		}>;
		houseData: {
			id: number;
			interiorId: number;
			isRenting: boolean;
			title: string;
			upgradeLevel: number;
			createdAt: Date;
		} | null;
		businessData: {
			id: number;
			type: number;
			level: number;
			createdAt: Date;
		} | null;
	};
}
