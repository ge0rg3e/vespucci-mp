import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('AmmuNation.LicenseCenter.MainDialog', {
	DialogTitle: {
		EN: `Trainer - Ammu-Nation`,
		RO: `Instructor - Ammu-Nation`
	},
	DialogContent: {
		EN: () => `Are you ready to learn to shoot a gun? Dont't miss the opportunity to be the best shooter in the city.`,
		RO: () => `Esti pregatit sa inveti sa tragi cu arma? Nu rata ocazia de a fi cel mai bun tragaci din oras.`
	},
	GetLicenseButton: {
		EN: 'Take License Test',
		RO: 'Sustine Examen de Arma'
	}
});

createLanguagePack('AmmuNation.LicenseCenter.ConfirmMainDialog', {
	DialogTitle: {
		EN: `Trainer - Ammu-Nation`,
		RO: `Instructor - Ammu-Nation`
	},
	DialogContent: {
		EN: ({ cost, level }) =>
			`Are you certain about taking the firearm license test? The fee is ${cost}, and it's applicable whether you pass the exam or not. The minimum level required is ${level}.`,
		RO: ({ cost, level }) =>
			`Ești sigur că vrei să susții examenul pentru licența de armă? Costul este de ${cost}, și va fi perceput indiferent dacă treci sau nu examenul. Nivelul minim necesar este ${level}.`
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

createLanguagePack('AmmuNation.LicenseCenter.ConfirmMainDialog.Responses', {
	NotEnoughMoney: {
		EN: ({ money }) => `You don't have enough money: ${formatNumber(money)}`,
		RO: ({ money }) => `Nu ai destui bani: ${formatNumber(money)}`
	},
	LevelNotEnough: {
		EN: ({ level }) => `You need to be at least level ${level} to get this license.`,
		RO: ({ level }) => `Trebuie să fi cel puțin nivel ${level} pentru această licență.`
	}
});

createLanguagePack('AmmuNation.LicenseCenter.TrainingDialog', {
	// Start info
	'stepTitle:1': {
		RO: `Introducere`,
		EN: `Introduction`
	},
	'stepContent:1': {
		RO: 'Bine ai venit la testul pentru obținerea licenței de arme! Înainte de a începe, vei primi câteva informații esențiale despre sistemul de arme.',
		EN: `Welcome to the Ammu-Nation licensing test! Before you start, you'll receive some crucial information about the weapon system.`
	},

	// Primary info
	'stepTitle:2': {
		RO: 'Cum să îți echipezi armele în joc',
		EN: 'How to Equip Weapons in Game'
	},
	'stepContent:2': {
		RO: 'Ca jucător, poți avea până la 4 arme echipate în Sloturile de Arme din inventarul tău. Odată ce îți echipezi armele, le poți folosii apăsând tastele 1-4. Dacă dorești să te întorci la pumnii goi, vei apăsa tasta zero.',
		EN: `As a player, you can have up to 4 weapons equipped in Weapon Slots from your inventory. Once you equip your weapons, you can use them by pressing keys 1-4. If you want to switch back to your fists, you'll press the zero key.`
	},

	// Secondary info
	'stepTitle:3': {
		RO: 'Obținerea și Utilizarea Muniției',
		EN: 'Where to Get Ammo and How to Use It'
	},
	'stepContent:3': {
		RO: 'Muniția poate fi obținută prin Crafting, din Ammu-Nation (limitat) sau prin negocierea cu alți jucători. Armele pot avea până la 256 de gloanțe, conform limitelor jocului. Pentru a reîncărca o armă, poți face acest lucru din inventar, tragând muniția peste arma respectivă.',
		EN: `Ammunition can be obtained through Crafting, from Ammu-Nation stores (limited), or by trading with other players. Weapons can carry up to 256 bullets, as per the game's limits. To reload a weapon, you can do so from your inventory by dragging the ammunition onto the weapon.`
	},

	// End info
	'stepTitle:4': {
		RO: 'Test Licență & Mai multe Informații',
		EN: 'License Test & More Information'
	},
	'stepContent:4': {
		RO: 'Pentru mai multe informații despre sistemul de arme, accesează Wiki-ul. În curând va începe un test: dispui de 18 gloanțe și 2 minute limită de timp. Pentru a obține licența, trebuie să nimeriți cel puțin 15 ținte în timpul acordat.',
		EN: 'For more information about the weapon system, visit the Wiki. Now, a test will begin: you have 18 bullets and a 2-minute time limit. To obtain the license, you need to hit at least 15 targets within the given time.'
	},

	// Key F for understanding
	ContinueKey: {
		RO: 'Continuă',
		EN: 'Continue'
	},
	StartKey: {
		EN: 'Start Test',
		RO: 'Incepe Test'
	}
});

createLanguagePack(`ammuNation.licenseCenter.failureReasons`, {
	'Not In Range': {
		EN: 'Test Failed: You are no longer within the designated shooting range.',
		RO: 'Test Eșuat: Nu mai ești în interiorul zonei de tragere.'
	},
	'Out of Ammo': {
		EN: 'Test Failed: Ammo Wasted. You ran out of ammo and failed to hit the targets.',
		RO: 'Test Eșuat: Muniție Epuizată. Ai irosit muniția și nu ai reușit să lovești țintele.'
	},
	'Out of Time': {
		EN: `Test Failed: Time Limit Exceeded.`,
		RO: 'Test Eșuat: Timpul a expirat.'
	},
	'Player Died': {
		EN: 'Test Failed: You have died during the test.',
		RO: 'Test Eșuat: Ai murit în timpul testului.'
	}
});

createLanguagePack(`ammuNation.licenseCenter.onSuccess`, {
	NotificationMessage: {
		EN: "Congratulations! Your weapon license is valid for 100 hours starting now! Don't forget to return and renew it when it expires.",
		RO: 'Felicitări! Licența de Arme este valabilă pentru 100 de ore începând de acum! Nu uita să revii și să o reînnoiești când expiră.'
	}
});
