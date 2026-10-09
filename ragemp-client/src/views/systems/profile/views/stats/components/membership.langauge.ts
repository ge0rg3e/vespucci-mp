import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	Civillians: {
		EN: 'Civillians',
		RO: 'Civili'
	},
	NotPartOfFaction: {
		EN: "You're not part of any faction",
		RO: 'Nu faci parte dintr-o facțiune'
	},
	Referrals: {
		EN: 'Referrals',
		RO: 'Referrals'
	},
	ActiveReferrals: {
		EN: ({ value }) => `${value} players affiliated`,
		RO: ({ value }) => `${value} jucători afiliați`
	},
	HowToGetRewards: {
		EN: `How to Get rewards`,
		RO: `Cum să obții premii`
	}
};

export default Language;
