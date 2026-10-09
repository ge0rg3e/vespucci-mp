import React, { useEffect, useState } from 'react';
import { ComponentState } from '..';

// Components
import { ClickAwayListener } from '@mui/material';

// Dependencies
import { InventoryItem } from '../sections/items/components/types';

const Component = () => {
	const { data, refs, lang, getItemMeta, getItemFromSlot } = ComponentState();
	const [slotData, _setSlotData] = useState<InventoryItem | null>(null);
	const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
	const slotDataRef: ExpectedAny = React.useRef(slotData);

	const setSlotData = (data: FixableAny) => {
		_setSlotData(data);
		slotDataRef.current = data;
		hideTooltip();
	};

	const closeContextMenu = () => {
		setSlotData(null);
		setMouseCoords({ x: 0, y: 0 });
	};

	useEffect(() => {
		// The user starts dragging an item
		if (slotData !== null && refs.current.activeDragId !== null) {
			closeContextMenu();
		}
		// eslint-disable-next-line
	}, [refs.current.activeDragId]);

	useEffect(() => {
		if (slotData !== null) {
			const exists = data.remoteInfo.inventory.find(
				(item: FixableAny) => item.id === slotData.id
			);
			if (!exists) {
				setSlotData(null);
			}
		}
		// eslint-disable-next-line
	}, [data]);

	const hideTooltip = () => document.dispatchEvent(new CustomEvent(`hideTooltip`));

	const onContextMenu = (event: FixableAny) => {
		if (
			refs.current.activeDragId !== null ||
			refs.current.data.disconnected === true ||
			slotDataRef.current !== null
		) {
			// if dragging is enabled or the player is now disconnected
			event.preventDefault();

			if (slotDataRef.current !== null) {
				setSlotData(null);
				hideTooltip();
			}
			return false;
		}

		const elm = event.target;
		const type = elm.getAttribute('data-type');
		if (type === 'item') {
			event.preventDefault();

			const slot = elm.getAttribute('data-slot');
			if (slotDataRef.current !== null && parseInt(slot) !== slotDataRef.current.slotId) {
				closeContextMenu();
				setTimeout(() => onContextMenu(event), 100);
				return false;
			} else if (
				slotDataRef.current !== null &&
				parseInt(slot) === slotDataRef.current.slotId
			) {
				event.preventDefault();
				closeContextMenu();
				return false;
			}
			const dataFetched = getItemFromSlot(refs.current.page, parseInt(slot));
			if (dataFetched === undefined) return false;
			setSlotData(dataFetched);
			setMouseCoords({ x: event.clientX, y: event.clientY });
		} else if (type === 'dropped-item') {
			event.preventDefault();
			window.rpc.callServer(
				`onDroppedItemPicked`,
				JSON.stringify({
					remoteId: refs.current.data.remoteId,
					id: elm.getAttribute('data-id')
				})
			);
		} else if (type === 'separated-item') {
			event.preventDefault();
			window.rpc.callServer(
				`pickItemFromSeparateInventory`,
				JSON.stringify({
					remoteId: refs.current.data.remoteId,
					id: elm.getAttribute('data-id')
				})
			);
		}
	};

	useEffect(() => {
		document.addEventListener('contextmenu', onContextMenu);
		return () => {
			document.removeEventListener('contextmenu', onContextMenu);
		};
		// eslint-disable-next-line
	}, []);

	const getStyleCoords = () => ({ left: mouseCoords.x, top: mouseCoords.y });

	const getContextOptions = () => {
		const options = [];
		const item = getItemMeta(slotData?.itemId);

		if (item.usable) {
			options.push({ text: lang.get('ContextUseItem'), action: 'use' });
		}

		if (item.dispensable) {
			options.push({
				text: lang.get('ContextMenuDestroy'),
				action: 'destroy'
			});
		}

		if (item.droppable) {
			options.push({
				text: lang.get('ContextMenuDrop'),
				action: 'dropped'
			});
		}

		return options;
	};

	const useContextOption = (event: FixableAny) => {
		const action = event.target.getAttribute('data-action');
		window.rpc.callServer(
			`onItemAction`,
			JSON.stringify({
				remoteId: data.remoteId,
				id: slotData!.id,
				action
			})
		);
		closeContextMenu();
	};

	if (slotData === null || refs.current.activeDragId !== null) return null;

	return (
		<ClickAwayListener onClickAway={closeContextMenu}>
			<div className="item-context-menu" style={getStyleCoords()}>
				{getContextOptions().map((option, index) => (
					<div
						key={index}
						className={`option`} // e si un sync aici
						data-action={option.action}
						onClick={useContextOption}
					>
						{option.text}
					</div>
				))}
				{getContextOptions().length < 1 && (
					<div className="option empty">{lang.get('NoOptionsAvailable')}</div>
				)}
			</div>
		</ClickAwayListener>
	);
};

export default Component;
