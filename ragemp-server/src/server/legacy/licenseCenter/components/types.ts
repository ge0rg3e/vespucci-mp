import { LicenseTypes } from '@modules/database/game/accounts/model/types';

export type LicenseBlipConfig = {
	[K in LicenseTypes]?: { position: Vector3; label: string };
};

declare global {
	interface PlayerVariables {
		licenseTest: {
			enabled: boolean;
			id: LicenseTypes | null;
			payload: Record<string, ExpectedAny>;
		};
	}
}

export {};
