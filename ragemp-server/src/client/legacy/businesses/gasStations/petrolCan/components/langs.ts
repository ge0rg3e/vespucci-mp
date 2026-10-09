import { formatNumber } from '@client/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack(`petrolCan:fillDialog`, {
	dialogFooter: {
		EN: ({ litres, totalCost }) => `Total Cost: ${formatNumber(litres)} ${litres == 1 ? 'litre' : 'litres'} of petrol costs ${formatNumber(totalCost, true)}`,
		RO: ({ litres, totalCost }) => `Cost Total: ${formatNumber(litres)} ${litres === 1 ? 'litru' : 'litri'} de benzină costă ${formatNumber(totalCost, true)}`
	}
});

createLanguagePack(`petrolCan:hint`, {
	defaultText: {
		EN: 'Fill vehicle with petrol can',
		RO: `Încarcă vehicul cu canistra`
	}
});
