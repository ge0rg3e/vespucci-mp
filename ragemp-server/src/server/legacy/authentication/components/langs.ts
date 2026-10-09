import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('onPlayerLogin', {
	WelcomeMessage: {
		EN: ({ username }) => `${username} has entered the game.`,
		RO: ({ username }) => `${username} a intrat în joc.`
	},
	StartedAgoMessage: {
		EN: ({ weeks, months }) => `Project started ${weeks} weeks, ${months} months ago.`,
		RO: ({ weeks, months }) => `Acest proiect a început acum ${weeks} săptămâni și ${months} luni.`
	},
	MessageLoggedInRank: {
		EN: ({ role, value }) => `You have the role of ${role} ${value}`,
		RO: ({ role, value }) => `Ai funcția de ${role} ${value}`
	},
	MessageJustLoggedIn: {
		EN: ({ username }) => `Welcome back in-game, ${username}!`,
		RO: ({ username }) => `Bun venit înapoi in joc, ${username}!`
	},
	RockstarId: {
		EN: "You've been logged in with a different Rockstar ID.",
		RO: 'Te-ai autentificat cu un alt Rockstar ID.'
	}
});

createLanguagePack(`authenticateSystem`, {
	KickAlreadyLoggedInHeading: {
		EN: 'Logged in from different location',
		RO: `Te-ai conectat din altă locație`
	},
	KickAlreadyLoggedInMessage: {
		RO: 'Dacă nu ți-ai dorit să se întâmple asta îți recomandăm să schimbi parola și să intrii iar in joc. {BR}Administratorii noștrii te vor putea ajuta, stai liniștit această acțiune a fost inregistrată și avem informațiile necesare (IP-ul celeilalte persoane, ș.a.m.d)',
		EN: `If you didn't wish for this to happen we're suggesting you to change the password and log back in-game.{BR}Our administrator will be able to help you, don't worry this action has been registtered and we have all required informations (the other person's IP address, and more)`
	}
});
createLanguagePack('onPlayerRegister', {
	WelcomeMessage: {
		EN: ({ username }) => `${username} has registered on this server.`,
		RO: ({ username }) => `${username} s-a înregistrat pe server.`
	},
	MessageJustRegistered: {
		EN: ({ username }) => `${username} has just registered in-game.`,
		RO: ({ username }) => `${username} s-a înregistrat în joc.`
	}
});
