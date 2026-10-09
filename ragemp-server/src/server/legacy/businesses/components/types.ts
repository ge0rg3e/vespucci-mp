import { BusinessesAttributes } from '@modules/database/game/businesses/model/types';

declare global {
	type BusinessLocations = {
		blip?: Vector3;
		buyPoint: Vector3;
		actors?: Array<{
			identifier: string;
			attributes: {
				model: string;
				name: string | undefined;
				coords: { x: number; y: number; z: number };
				heading: number;
				frozen: boolean;
				invincible: boolean;
			};
			camera?: {
				direction: { x: number; y: number; z: number };
				coords: { x: number; y: number; z: number };
			};
		}>;
		callToActions: Array<{
			id: string;
			coords: Vector3;
			options: {
				colshapeRadius?: number;
				marker?: {
					disabled?: boolean;
					iconMarkerId?: number;
					radius?: number;
					zNegative: number;
					color?: [number, number, number, number];
				};
			};
			payload?: ExpectedAny;
		}>;
	};

	type BusinessConfigs = {
		type?: number;
		mapLabel?: string;
		blipIcon?: number;
		safezones?: Array<{
			coords: { x: number; y: number; z: number };
			radius: number;
		}>;
	};

	interface Business extends Omit<BusinessesAttributes, 'locations' | 'configs'> {
		locations: BusinessLocations;
		configs: BusinessConfigs;
	}

	interface PlayerVariables {
		businessUsed: {
			id: number;
			meta?: Record<string, ExpectedAny>;
		} | null;
	}

	interface ActorsInfo {
		business?: {
			id: number /* Business ID */;
		};
	}
}

export {};
