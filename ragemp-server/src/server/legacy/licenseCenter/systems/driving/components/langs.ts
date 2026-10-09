import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('LicenseCenter.Driving.MainDialog', {
	DialogTitle: {
		EN: 'Driving School',
		RO: 'Scoala de Soferi'
	},
	DialogContent: {
		EN: "Welcome to the driving school! Are you ready to get your driver's license?",
		RO: 'Bine ai venit la scoala de soferi! Esti pregatit sa iti iei permisul de conducere?'
	},
	DialogButton: {
		EN: 'Get License',
		RO: 'Ia-ti permisul'
	}
});

createLanguagePack('LicenseCenter.Driving.ConfirmMainDialog', {
	DialogTitle: {
		EN: 'Driving School',
		RO: 'Scoala de Soferi'
	},
	DialogContent: {
		EN: ({ cost }) => `Are you certain about taking the driving license test? The fee is ${cost}, and it's applicable whether you pass the exam or not.`,
		RO: ({ cost }) => `Esti sigur ca vrei sa sustii examenul pentru permisul de conducere? Costul este de ${cost}, si va fi perceput indiferent daca treci sau nu examenul.`
	},
	DialogContentAlreadyHasLicense: {
		EN: 'License already active. Return at least 10 hours before expiration.',
		RO: 'Licență deja activă. Reveniți cu cel puțin 10 ore înainte de expirare.'
	},
	ConfirmButton: {
		EN: 'Confirm',
		RO: 'Confirmă'
	},
	DismissButton: {
		EN: 'Dismiss',
		RO: 'Cancel'
	}
});

createLanguagePack('LicenseCenter.Driving.ConfirmMainDialog.Responses', {
	NotEnoughMoney: {
		EN: ({ money }) => `You don't have enough money: ${formatNumber(money)}`,
		RO: ({ money }) => `Nu ai destui bani: ${formatNumber(money)}`
	}
});

createLanguagePack('LicenseCenter.Driving.BeforeStartDialog', {
	DialogTitle: {
		EN: 'Driving School',
		RO: 'Scoala de Soferi'
	},
	'DialogContent@1': {
		EN: 'Welcome to the driving license test. I will present you with some useful information to become a better driver.',
		RO: 'Bun venit la testul de licenta pentru condus. Iti voi prezenta mici informatii folositoare pentru a devenii un sofer mai bun.'
	},
	'DialogContent@2': {
		EN: "Let's start with the vehicle controls: The engine of a vehicle is started with the 2 key, The radio of the vehicle can be changed while holding the Q key",
		RO: 'Sa incepem cu controlul masinii: Motorul unui vehicul se porneste de pe tasta 2, Radio-ul masinii il poti schimba cand tii apasat tasta Q'
	},
	'DialogContent@3': {
		EN: 'To take the practical test at this test all you have to do is follow the checkpoints that are marked on the map. If you pass all the checkpoints you will pass the test.',
		RO: 'Pentru a lua proba practica la acest test tot ce trebuie sa faci este sa urmezi checkpoint-urile care sunt marcate pe harta. Daca vei trece de toate checkpoint-urile vei trece testul.'
	},
	DialogButton: {
		EN: ({ isLastContent }) => (isLastContent ? 'Start the test' : 'Continue'),
		RO: ({ isLastContent }) => (isLastContent ? 'Incepe proba' : 'Continua')
	}
});

createLanguagePack('LicenseCenter.Driving.BeforeStart', {
	NotificationMessage: {
		EN: 'Let the test begin! Press 2 to start the engine!',
		RO: 'Sa inceapa testul! apasa 2 pentru a porni motorul!'
	}
});

createLanguagePack('LicenseCenter.Driving.BeforeFail', {
	NotificationMessage: {
		EN: ({ reason }) => `You are about to fail the driving test. ${reason}`,
		RO: ({ reason }) => `Esti pe cale sa pici examenul de conducere. ${reason}`
	},
	ReasonExitVehicle: {
		EN: 'You have 30 seconds to get back in the vehicle',
		RO: 'Ai 30 de secunde sa te urci inapoi in vehicul'
	},
	ReasonDamageVehicle: {
		EN: ({ remainedDamages }) => `You have damaged your vehicle. You can damage it ${remainedDamages} more times before failing the test.`,
		RO: ({ remainedDamages }) => `Ai avariat vehiculul. Mai poti avaria de ${remainedDamages} ori inainte de a pica testul.`
	}
});

createLanguagePack('LicenseCenter.Driving.Fail', {
	NotificationMessage: {
		EN: ({ reason }) => `You have failed the driving test. Reason: ${reason}`,
		RO: ({ reason }) => `Ai picat examenul de conducere. Motiv: ${reason}`
	},
	ReasonDied: {
		EN: 'You died',
		RO: 'Ai murit'
	},
	ReasonDamagedVehicleTooMuch: {
		EN: 'You damaged the vehicle too much',
		RO: 'Ai avariat prea mult vehiculul'
	},
	ReasonVehicleTooFarWithoutBeingIn: {
		EN: 'You are no longer with the vehicle.',
		RO: 'Nu mai aproape de vehicul.'
	},
	ReasonExitVehicle: {
		EN: 'You left the vehicle',
		RO: 'Ai parasit vehiculul'
	},
	ReasonCheckpointTooFar: {
		EN: 'You are too far from the checkpoint',
		RO: 'Esti prea departe de checkpoint'
	}
});

createLanguagePack('LicenseCenter.Driving.Success', {
	NotificationMessage: {
		EN: 'You have passed the driving test. Congratulations!',
		RO: 'Ai trecut examenul de conducere. Felicitari!'
	}
});
