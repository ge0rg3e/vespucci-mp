import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Houses', {
	OwnedHouse: {
		EN: ({ username }) => `This house is owned by ${username}.`,
		RO: ({ username }) => `Această casă este deținută de ${username}.`
	},
	SellingHouse: {
		EN: ({ price, level }) => `You need ${formatNumber(price, true)} and level ${level} to buy this house.`,
		RO: ({ price, level }) => `Ai nevoie de ${formatNumber(price, true)} si level ${level}.`
	},
	EnterHouse: {
		EN: `Enter this house`,
		RO: `Intră in casă`
	},
	BuyHouse: {
		EN: `Buy this house`,
		RO: `Cumpară această casă`
	},
	HouseInformation: {
		EN: ({ interior, price, level }) => `You can buy this house with interior id ${interior}, level ${level} for ${formatNumber(price, true)}`,
		RO: ({ interior, price, level }) => `Tu poți cumpara această casă cu interior id ${interior}, level ${level} pentru ${formatNumber(price, true)}`
	},
	BuyingHouseHeader: {
		EN: `Are you sure want buy this house?`,
		RO: `Ești sigur ca vrei să cumperi această casă?`
	},
	NotEnoughMoney: {
		EN: ({ amount }) => `You don't have ${formatNumber(amount, true)} to buy this house.`,
		RO: ({ amount }) => `Nu ai ${formatNumber(amount, true)} pentru a cumpăra această casă.`
	},
	NotEnoughLevel: {
		EN: () => `Your level is too low to buy this house.`,
		RO: () => `Nivelul tau este prea scazut pentru a cumpăra această casă.`
	},
	AlreadyOwnHouse: {
		EN: () => `You already own a house.`,
		RO: () => `Deja deții o casă.`
	},
	BoughtHouse: {
		EN: ({ amount }) => `You bought this house successfully for ${formatNumber(amount, true)}.`,
		RO: ({ amount }) => `Ai cumpărat această casa cu success pentru ${formatNumber(amount, true)}.`
	},
	ExitHouseHeader: {
		EN: `House door`,
		RO: `Ușă casă`
	},
	ExitHouse: {
		EN: `What action would you like to do?`,
		RO: `Ce acțiune dorești să faci?`
	},
	ExitHouseButton: {
		EN: `Leave house`,
		RO: `Ieși din casă`
	},
	EnterGarageButton: {
		EN: `Enter garage`,
		RO: `Du-te în garaj`
	},
	RentHouse: {
		EN: `Rent a room`,
		RO: `Inchiriaza o cameră`
	},
	RentHouseWarning: {
		EN: ({ money }) => `This house is for renting for ${formatNumber(money, true)}`,
		RO: ({ money }) => `Aceasta casa este de inchiriera pentru ${formatNumber(money, true)}`
	},
	RentHouseHeader: {
		EN: `Renting a room`,
		RO: `Inchirere cameră`
	},
	AlreadyRenting: {
		EN: `You already renting a house`,
		RO: `Deja inchiriezi o casa`
	},
	SuccesRent: {
		EN: `Now you rent this house.`,
		RO: `Acum inchiriezi aceasta casa.`
	},
	YouRentHouse: {
		EN: `You can't buy this house because you rent one.`,
		RO: `Nu poti cumpara aceasta casa pentru ca inchiriezi una`
	},
	YouSoldToTheState: {
		EN: ({ reward }) => `You sold your house to the state for ${reward}`,
		RO: ({ reward }) => `Ti-ai vândut casa la stat pentru ${reward}`
	},
	YouUpgradedYourHouse: {
		EN: ({ cost, level }) => `You paid ${cost}. Your house upgrade level is now ${level}`,
		RO: ({ cost, level }) => `Ai plătit ${cost}. Casa ta are acum upgrade level ${level}`
	},
	LeftRenting: {
		EN: () => `You left your house rent successfully.`,
		RO: () => `Ți-ai părăsit chiria cu success.`
	},
	HouseUpgradeLevelIsTooSmall: {
		EN: ({ val }) => `The house upgrade level must be at least ${val} to to use this.`,
		RO: ({ val }) => `Nivelul de upgrade al casei trebuie sa fie minim ${val} pentru a-l folosii.`
	}
});
