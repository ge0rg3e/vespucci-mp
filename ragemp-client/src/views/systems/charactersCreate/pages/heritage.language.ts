import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	Parents: {
		EN: 'Parents',
		RO: 'Părinți'
	},
	Mother: {
		EN: 'Mother',
		RO: 'Mamă'
	},
	Father: {
		EN: 'Father',
		RO: 'Tată'
	},
	SampleNo: {
		EN: ({ value }) => `Sample No. ${value + 1}`,
		RO: ({ value }) => `Mostră Nr. ${value + 1}`
	},
	Gender: {
		EN: 'Gender',
		RO: 'Sex'
	},
	MaleGender: {
		EN: `Male`,
		RO: `Bărbat`
	},
	FemaleGender: {
		EN: `Female`,
		RO: `Femeie`
	},
	Preferences: {
		EN: `Preferences`,
		RO: `Preferințe`
	},
	Resemblance: {
		EN: `Resemblance`,
		RO: `Asemnănare`
	},
	SkinTone: {
		EN: `Skin Tone`,
		RO: `Ton Piele`
	}
};

export default Language;
