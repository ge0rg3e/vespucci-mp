import { Houses } from '@server/legacy/houses/components/core';
import { getLanguagePack } from '@vmp/i18n';

export const showHouseStorageDialog = (player: PlayerMp) => {
	const lang = getLanguagePack(`houseStorages`, player.info.language);
	const house = Houses.find((h) => h.id === player.vars.houseEntered);

	if (!house) return false;

	let dialogContent = lang.get('StorageClosetDescription');

	let buttons = [
		{
			key: 'F',
			text: lang.get('UseStorageCloset')
		}
	];

	if (player.getAdminLevel() > 3) {
		buttons.push({
			key: 'G',
			text: lang.get('FriskStorageInventories')
		});
	}

	if (house.upgradeLevel < 3) {
		buttons = [];
		dialogContent = lang.get('HouseUpgradeLevelIsTooSmall', { val: 3 });
	}

	player.showPlayerDialog({
		dialogId: `houseStorageCloset`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: 1,
		type: 'message',
		buttons,
		title: lang.get('StorageClosetTitle'),
		content: dialogContent,
		payload: {
			houseId: house.id
		}
	});

	return true;
};

export const showHouseStorageList = (player: PlayerMp) => {
	const house = Houses.find((h) => h.id === player.vars.houseEntered);

	if (!house) return false;

	const lang = getLanguagePack(`houseStorages`, player.info.language);
	const commonLang = getLanguagePack(`dialogGeneral`, player.info.language);

	let dialogContent = ``;
	let dialogType: dialogType = 'list';
	let listProps = undefined;
	let buttons: ExpectedAny = [
		{
			text: lang.get('Cancel'),
			key: `ESC`
		}
	];

	if (house.inventories.length > 0) {
		dialogContent = lang.get('SelectInventory');
		listProps = {
			columns: [commonLang.get('Owner'), lang.get('NumberItems')],
			entries: house.inventories.map((entry: HouseInventory) => [entry.username, entry.items.length])
		};
		buttons = [
			{
				text: commonLang.get('Select'),
				key: `ENTER`
			}
		];
	} else {
		dialogContent = lang.get('NoInventories');
		dialogType = 'message';
	}

	player.showPlayerDialog({
		dialogId: `houseStorageCloset:FriskList`,
		icon: 'information',
		hideInSeconds: null,
		type: dialogType,
		listProps,
		buttons,
		title: lang.get('InventoryList'),
		content: dialogContent,
		payload: {
			houseId: house.id
		}
	});

	return true;
};
