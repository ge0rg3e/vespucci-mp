import { ConfigurationAttributes } from '@modules/database/shared/configurations/model/types';

type lastDefaultGameClothingIdsBase = {
	tops: number;
	torsos: number;
	undershirts: number;
	pants: number;
	shoes: number;
	hats: number;
	glasses: number;
	masks: number;
	accessories: number;
	earings: number;
	watches: number;
	bracelets: number;
	backpacks: number;
};

declare global {
	type DefinedServerConfigurations = {
		lastDefaultGameClothingIds: {
			male: lastDefaultGameClothingIdsBase;
			female: lastDefaultGameClothingIdsBase;
		};
	};

	interface ServerConfiguration extends ConfigurationAttributes {
		id: number;
		value: ExpectedAny;
	}
}

export {};
