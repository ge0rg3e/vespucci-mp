import React, { useEffect } from 'react';

const Component = (props: Props) => {
	// If the slot is empty meaning no weapon is equipped.
	if (props.data === null) {
		return (
			<div
				className="entry empty"
				data-draggable={'false'}
				data-type="weapon::empty-slot"
				data-id={`${props.slotNumber}`}
			>
				<div className="slotNumber">{props.slotNumber}</div>
				<div className="content">
					<div className="text">Empty</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="entry"
			data-draggable={'true'}
			draggable={true}
			data-type="weapon::equipped-slot"
			data-id={`${props.slotNumber}`}
			id={`weapon::equipped-slot-${props.slotNumber}`} // Needed for drag event
		>
			<div className="slotNumber">{props.slotNumber}</div>
			<div className="content">
				<img
					className={`image grid-image-size`}
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					// onError={(ev: UndefinedAny) =>
					// 	(ev.target.src = `/assets/images/systems/inventory/clothes/${props.type}.png`)
					// }
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
					src={`${__ASSETS__}/weapons/${props.data.weaponId}.png`}
				/>
				<div className="hidden-background"></div>
			</div>
		</div>
	);
};

type Props = {
	slotNumber: number;
	data: PlayerWeapon | null;
};

export default Component;
