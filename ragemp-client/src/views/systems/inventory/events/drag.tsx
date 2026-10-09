import { useEffect } from 'react';
import { ComponentState } from '..';
import { InventoryItem } from '../sections/items/components/types';

const Component = () => {
	const { setActiveDragId, setActiveDragType, refs, setPage } = ComponentState();

	const moveElementCloneToMouseCoords = async (x: number, y: number) => {
		const id = refs.current.activeDragId;
		if (id === null) return false;
		const insertedChild = document.getElementById(`${refs.current.activeDragType}-${id}-ghost`);
		if (!insertedChild) return false;
		insertedChild.style.top = `${x}px`;
		insertedChild.style.left = `${y}px`;
	};

	const onMouseMove = async (event: UndefinedAny) => {
		const { clientX, clientY } = event;
		const top = clientY - 65;
		const left = clientX - 65;
		moveElementCloneToMouseCoords(top, left);
	};

	const onMouseReleased = async (event: UndefinedAny) => {
		if (refs.current.activeDragId !== null && event.button !== 2) {
			event.preventDefault();
			const { clientX, clientY } = event;

			const elements: UndefinedAny = document.elementsFromPoint(clientX, clientY);
			const tabElement = elements.find((e: ExpectedAny) => e.id === 'inventory-tab');

			if (tabElement) {
				const tabNumber = parseInt(tabElement.getAttribute('data-page'));
				if (refs.current.page !== tabNumber) {
					setPage(tabNumber);
					event.preventDefault();
					return false;
				}
			}

			const draggingNow = refs.current.activeDragType;
			const draggingId = refs.current.activeDragId;

			if (draggingId === null) return false;

			const divId = `${draggingNow}-${draggingId}`;

			// Deleting the ghost item..
			const itemGhostElement: ExpectedAny = document.getElementById(`${divId}-ghost`);

			if (itemGhostElement) {
				// being careful.
				itemGhostElement.remove();
			}

			// Cleaning up..
			refs.current.activeDragType = null;
			refs.current.activeDragId = null;

			setActiveDragId(null);
			setActiveDragType(null);

			if (refs.current.data.disconnected === true) {
				cleanDraggingElement();
				return false;
			}

			const target: UndefinedAny = document.elementFromPoint(clientX, clientY);
			const dest = target.getAttribute('data-type');
			const targetId = target.getAttribute('data-id');
			let eventEmitted = false;

			// @Weapons: If we drag an item over an weapon item.
			if (dest === 'item' && draggingNow === 'item' && targetId !== draggingId) {
				// Get the item we're dragging to...
				const targetItem = refs.current.data.remoteInfo.inventory.find((c: InventoryItem) => c.id === targetId);

				// If we drag ammunition over weapons.
				if (targetItem.itemId === 25) {
					// Try to execute the action
					const res = await window.rpc.callServer(
						`playerWeapons.inventory@draggingItemOverWeaponItem`,
						JSON.stringify({
							remoteId: refs.current.data.remoteId,
							draggedItemId: draggingId,
							targetItemId: targetId
						})
					);

					// If we succeeded we need to make sure we don't swap the items places.
					if (res) {
						cleanDraggingElement();
						return true;
					}
				}
			}

			// @Weapons: If we drag a weapon compatible item (component, ammo) to an equipped slot.
			if (dest === 'weapon::equipped-slot' && draggingNow === 'item') {
				const slot = target.getAttribute(`data-id`);

				const res = await window.rpc.callServer(
					`playerWeapons.inventory@draggingItemOverWeaponSlot`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						slot: parseInt(slot)
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// Dragging current clothing to his inventory empty slot
			if (draggingNow === 'clothing' && dest === 'empty-slot') {
				const res = await window.rpc.callServer(
					`clothing:draggedClothingToInventory`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						slot: parseInt(target.getAttribute('data-slot')),
						page: refs.current.page
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// Dragging clothing from his inventory to his clothes
			// @Todo: To also work for "Remote Inventories"
			if ((dest === 'clothing' || dest === 'empty-clothing') && draggingNow === 'item') {
				const res = await window.rpc.callServer(
					'clothing:equipClothingItem',
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						draggedClothingType: target.getAttribute('data-clothes-type')
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if ((dest === 'empty-slot' || dest === 'item') && draggingNow === 'item' && targetId !== draggingId) {
				// Dragging items over other items or empty slots in stores.

				const action = target.getAttribute('data-type') !== 'empty-slot' ? 'swap' : 'move';

				const res = await window.rpc.callServer(
					`onInventoryItemMoved`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						slot: parseInt(target.getAttribute('data-slot')),
						page: refs.current.page,
						action
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if ((dest === 'empty-slot' || dest === 'item') && draggingNow === 'dropped-item') {
				// picking up an item
				const res: ExpectedAny = window.rpc.callServer(
					`onDroppedItemPicked`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						slot: parseInt(target.getAttribute('data-slot')),
						page: refs.current.page,
						id: draggingId
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if ((dest === 'drop-items-zone' || dest == 'empty-dropped-slot') && draggingNow === 'item') {
				// dropping an item
				const res: ExpectedAny = await window.rpc.callServer(
					`onItemAction`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						action: `dropped`
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if ((dest === 'empty-separated-slot' || dest === 'separated-item') && draggingNow === 'item') {
				// moving an item from inventory to separated inventory
				const res: ExpectedAny = await window.rpc.callServer(
					`addItemToSeparateInventory`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						slot: parseInt(target.getAttribute('data-slot')),
						id: draggingId
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if ((dest === 'empty-slot' || dest === 'item') && draggingNow === 'separated-item') {
				// moving an item from separated inventory to inventory
				const res: ExpectedAny = await window.rpc.callServer(
					`pickItemFromSeparateInventory`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						page: refs.current.page,
						slot: parseInt(target.getAttribute('data-slot')),
						id: draggingId
					})
				);
				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			if (
				(dest === 'empty-separated-slot' || dest === 'separated-item') &&
				draggingNow === 'separated-item' &&
				targetId !== draggingId
			) {
				// moving an item from separated inventory to separated inventory
				const action = target.getAttribute('data-type') !== 'empty-separated-slot' ? 'swap' : 'move';

				const res = await window.rpc.callServer(
					`moveItemToSeparateInventory`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						slot: parseInt(target.getAttribute('data-slot')),
						id: draggingId,
						action
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// @Weapons: If we drag a weapon equipped to the inventory for storage
			if ((dest === 'empty-slot' || dest === 'item') && draggingNow === 'weapon::equipped-slot') {
				const res = await window.rpc.callServer(
					`playerWeapons.inventory@moveWeaponToInventory`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						slot: parseInt(draggingId),
						inventoryDestination: {
							slot: parseInt(target.getAttribute('data-slot')),
							page: refs.current.page
						}
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// @Weapons: If we drag a weapon item to an empty slot.
			if ((dest === 'weapon::empty-slot' || dest === 'weapon::equipped-slot') && draggingNow === 'item') {
				const slot = target.getAttribute(`data-id`);

				const res = await window.rpc.callServer(
					`playerWeapons.inventory@equipWeaponItemToSlot`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						id: draggingId,
						slot: parseInt(slot),
						action: dest === 'weapon::empty-slot' ? 'equip' : 'swap'
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// @Weapons: If we drag a weapon over an empty or occupied weapon slot (to swap)
			if (
				(dest === 'weapon::empty-slot' || dest === 'weapon::equipped-slot') &&
				draggingNow === 'weapon::equipped-slot'
			) {
				// Get the slot were we're moving.
				const slot = target.getAttribute(`data-id`);

				const res = await window.rpc.callServer(
					`playerWeapons.inventory@changeWeaponSlot`,
					JSON.stringify({
						remoteId: refs.current.data.remoteId,
						currentSlot: parseInt(draggingId),
						targetSlot: parseInt(slot)
					})
				);

				// Checking if the server successfully confirms that an action has been made
				eventEmitted = res ? true : false;
			}

			// If operation failed => the item will show up in the original slot
			// If operation successful => when we get new data sent we will call the function below

			if (eventEmitted === false) return cleanDraggingElement();
		}
	};

	const onDragStart = async (event: ExpectedAny) => {
		// We prevent the default so we don't see a ghosty ass item hovering.
		event.preventDefault();

		// If we are dragging something already.
		if (refs.current.activeDragId !== null) return false;

		// Old legacy checks
		if (
			document.getElementsByClassName('item-context-menu')[0] || // if the context menu is opened
			refs.current.data.disconnected === true // if the player is offline
		) {
			return false;
		}

		const div = event.target;
		const draggable = div.getAttribute('data-draggable');
		const type = div.getAttribute('data-type');
		const id = div.getAttribute(`data-id`);

		const allowedTypes = ['item', 'dropped-item', 'separated-item', 'clothing', 'weapon::equipped-slot'];

		if (draggable === 'true' && allowedTypes.includes(type)) {
			setActiveDragId(id);
			setActiveDragType(type);

			const divId = `${type}-${id}`;
			const itemSelected = document.getElementById(divId);
			const sourceList: UndefinedAny = itemSelected?.parentElement;

			if (!itemSelected || !sourceList) {
				setActiveDragId(null);
				setActiveDragType(null);
				return false;
			}

			const itemClone: UndefinedAny = itemSelected.cloneNode(true);
			itemClone.className += ' ghost';

			itemClone.id = `${divId}-ghost`;

			// Remove the "draggable" attribute
			itemClone.removeAttribute('draggable');

			sourceList.appendChild(itemClone);

			// Hiding the current item selected while dragging around the clone
			itemSelected.className += ' being-dragged';

			// Setting the default height and width and moving the clone to the right pos.
			const insertedChild: UndefinedAny = document.getElementById(`${divId}-ghost`);
			const rect = itemSelected.getBoundingClientRect();

			// Setting Initial styling..
			insertedChild.style.height = `${rect.height}px`;
			insertedChild.style.width = `${rect.width}px`;
			const { clientX, clientY } = event;

			const top = clientY - 65;
			const left = clientX - 65;
			insertedChild.style.top = `${top}px`;
			insertedChild.style.left = `${left}px`;
		}
	};

	useEffect(() => {
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseReleased);
		document.addEventListener('dragstart', onDragStart);
		// @Reminder: DragEnd is not triggered not sure why so I'm using mouseup.

		return () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseReleased);
			document.removeEventListener('dragstart', onDragStart);
		};
		// eslint-disable-next-line
	}, []);

	return null;
};

export const cleanDraggingElement = () => {
	// Once the items refreshed we must fix any glitches
	const element = document.getElementsByClassName(`being-dragged`)[0];
	if (!element) return false;
	element.className = element.className.replace('being-dragged', '');
};

export default Component;
