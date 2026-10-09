import RadiosDb from '@modules/database/natives/radios/repository';
import { logError } from '@server/utils/helpers';
import { RadioNativeInfo } from './types';
import { green } from 'colorette';

export let nativeRadios: Array<RadioNativeInfo> = [];

export const loadNativeRadios = async () => {
	try {
		// Load them from the database
		const res = await RadiosDb.getRadios();
		nativeRadios = res;

		// Inform..
		console.info(`${green('[DONE]')} Loaded ${res.length} radios.`);
	} catch (err) {
		await logError(`LOAD_NATIVE_RADIOS`, err);
		process.exit(1);
	}
};

export const getNativeRadio = ({ id, name }: { id?: number; name?: string }) => {
	const match = nativeRadios.find((radio) => {
		if (id && radio.id === id) return true;
		if (name && radio.label.toLowerCase() === name.toLowerCase()) return true;
		return false;
	});
	if (!match) return null;
	return match;
};
