import { Houses, updateHouse } from '@server/legacy/houses/components/core';
import { formatNumber } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'houseSafeDialog') return;

	const house = Houses.find((h) => h.id === response.payload.houseId);

	if (!house) return false; // safety check

	const lang = getLanguagePack(`HouseSafeBox`, player.info.language);

	if (['Y', 'N'].includes(response.responseKey) && response.payload.case === 'choose') {
		player.showPlayerDialog({
			inputProps: { type: 'number' },
			dialogId: response.dialogId,
			hideInSeconds: null,
			icon: 'question',
			type: 'input',
			buttons: [
				{
					key: 'Y',
					text: lang.get(`ActionButtons`, { key: 'Y' })
				},
				{
					key: 'N',
					text: lang.get(`ActionButtons`, { key: 'N' })
				}
			],
			title: lang.get(`Title`),
			content: lang.get(`ActionContent`, { value: formatNumber(house.balance, true), key: response.responseKey }),
			payload: {
				houseId: house.id,
				case: response.responseKey === 'Y' ? 'withdraw' : 'deposit'
			}
		});
		this.cancel = true;
		return;
	}

	if (response.payload.case !== 'choose' && response.responseKey === 'Y') {
		if (!response.inputText) return false;

		const value = Number(response.inputText);

		if (value < 1) return false;

		if (response.payload.case === 'withdraw') {
			if (value > house.balance) return player.alert({ type: 'error', message: lang.get(`OverAmount`) });

			player.alert({ type: 'success', message: lang.get(`Withdraw`, { amount: value, totalAmount: house.balance - value }) });

			player.giveMoney(value);

			updateHouse(house.id, {
				balance: house.balance - value
			});

			player.hidePlayerDialog();

			this.cancel = true;
			return;
		}

		if (response.payload.case === 'deposit') {
			if (value > player.info.money) return player.alert({ message: lang.get(`NoMoney`), type: 'error' });

			player.alert({ type: 'success', message: lang.get(`Deposit`, { amount: value, totalAmount: house.balance + value }) });

			player.setMoney(player.info.money - value);

			updateHouse(house.id, {
				balance: house.balance + value
			});

			player.hidePlayerDialog();

			this.cancel = true;
			return;
		}
	}

	if (response.payload.case !== 'choose' && response.responseKey === 'N') {
		player.hidePlayerDialog();
		this.cancel = true;
		return;
	}
});
