import { formatNumber } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

mp.items.create({
	id: 11,
	name: {
		EN: 'Dices',
		RO: 'Zaruri'
	},
	description: {
		EN: 'Play dice games with other players.',
		RO: 'Joacă jocuri de zaruri cu alți jucători.'
	},
	droppable: true,
	tradable: true,
	// Max one..
	stackable: false,
	limit: 1,
	notDepositable: true,
	dispensable: true,
	usable: false,
	callbacks: {},
	getProperties: ({ player, meta, shopId }) => {
		// Get the language
		const lang = getLanguagePack(`itemProperties:11`, player.lang);

		// Get properties..
		const arr = [
			{
				label: lang.get(`usageLabel`),
				value: lang.get(`usageValue`)
			}
		];

		// If is not the shop interface let's show score
		if (!shopId) {
			arr.push({
				label: lang.get('wins'),
				value: meta.totalGames === 0 ? lang.get('notUsed') : `${formatNumber(meta.wins, false)}/${formatNumber(meta.totalGames, false)}`
			});
		}

		return arr;
	}
});
