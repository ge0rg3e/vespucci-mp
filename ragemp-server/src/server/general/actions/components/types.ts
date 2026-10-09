import { createActionsParams } from '@modules/database/shared/actions/repository/types';

declare global {
	interface ActionTranslation {
		name: string;
		en: string;
		ro?: string;
	}
}

export interface cActionParamsV2 extends Omit<createActionsParams, 'variables' | 'meta'> {
	variables?: Record<string, ExpectedAny>;
	meta?: Record<string, ExpectedAny>;
}

export {};
