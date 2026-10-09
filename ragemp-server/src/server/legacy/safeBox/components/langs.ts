import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('HouseSafeBox', {
	Title: {
		EN: `House safe`,
		RO: `Seif casă`
	},
	SafeContent: {
		EN: ({ value }) => `The balance of this safe is ${value}.{BR} What would you like to do with this amount?`,
		RO: ({ value }) => `In acest seif se afla suma de ${value}.{BR} Ce dorești să faci cu această sumă?`
	},
	NotAllowedSafeContent: {
		EN: `Only the owner of the house can use the safe.`,
		RO: `Doar propietarul acestei case poate folosii seiful.`
	},
	DepositButton: {
		EN: 'Deposit',
		RO: 'Depozitează'
	},
	WithdrawButton: {
		EN: 'Withdraw',
		RO: 'Retrage'
	},
	ActionButtons: {
		EN: ({ key }) => (key === 'Y' ? 'Ok' : 'Cancel'),
		RO: ({ key }) => (key === 'Y' ? 'Ok' : 'Anulare')
	},
	ActionContent: {
		// eslint-disable-next-line
		EN: ({ key, value }) =>
			key === 'Y' ? `The balance of this safe is ${value}.{BR}What amount do you want to withdraw?` : `The balance of this safe is ${value}.{BR}How much do you want to deposit?`,
		RO: ({ key, value }) => (key === 'Y' ? `In acest seif se afla suma de ${value}.{BR}Ce suma vrei sa retragi?` : `In acest seif se afla suma de ${value}.{BR}Cât vrei să depui?`)
	},
	OverAmount: {
		EN: `You don't have this amount in your safe.`,
		RO: 'Nu aveți această sumă în seif.'
	},
	NoMoney: {
		EN: `You don't have that amount with you.`,
		RO: 'Nu ai această sumă la tine.'
	},
	Deposit: {
		EN: ({ amount, totalAmount }) => `You deposited ${formatNumber(amount, true)} and now you have a total balance of ${formatNumber(totalAmount, true)}`,
		RO: ({ amount, totalAmount }) => `Ai depus ${formatNumber(amount, true)}. Balanța din seif este acum de ${formatNumber(totalAmount, true)}`
	},
	Withdraw: {
		EN: ({ amount, totalAmount }) => `You withdrew ${formatNumber(amount, true)} and now you have left a balance of ${formatNumber(totalAmount, true)}`,
		RO: ({ amount, totalAmount }) => `Ai retras ${formatNumber(amount, true)} și ai rămas cu o balanță de ${formatNumber(totalAmount, true)}`
	}
});
