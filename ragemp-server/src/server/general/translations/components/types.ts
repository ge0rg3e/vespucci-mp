import { TranslationsAttributes } from '@modules/database/shared/translations/model/types';

declare global {
	interface GameTranslation extends TranslationsAttributes {
		id: number;
	}

	interface UndefinedGameTranslation extends Omit<TranslationsAttributes, 'id' | 'ro'> {
		system: string; // just so i can create this.
	}
}

export {};
