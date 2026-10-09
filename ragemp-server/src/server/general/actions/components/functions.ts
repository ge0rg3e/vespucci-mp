import { logError } from '@server/utils/helpers';

// Datatabase
import Actions from '@modules/database/shared/actions/repository';
import { cActionParamsV2 } from './types';

export const createAction = async (params: cActionParamsV2) => {
	try {
		const res = await Actions.insert({
			type: params.type,
			translationId: params.translationId,
			accountId: params.accountId,
			variables: JSON.stringify(params.variables || {}),
			meta: JSON.stringify(params.meta || {})
		});
		return res;
	} catch (err) {
		await logError(`CREATE_ACTION`, err, { params });
		throw err;
	}
};

export const convertActionTranslations = (arr: Array<ActionTranslation>) =>
	arr.map((elm: ExpectedAny) => {
		const { name, ...rest } = elm;

		return {
			component: name,
			system: 'Actions',
			...rest
		};
	});
