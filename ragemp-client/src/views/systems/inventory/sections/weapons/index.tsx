import React, { useEffect } from 'react';

// Context
import { ComponentState } from '../..';

// Components
import WeaponSlot from './components/weaponSlot';

// Language sets.
import './language';
import { getLanguagePack } from '@vmp/i18n';

const Component = () => {
	const { getWeaponFromSlot, isDarkEnvironment, removeWeaponFromSlot } = ComponentState();

	// Get language pack already defined above.
	const lang = getLanguagePack('inventory@weapons.interface', window.language);

	const onRightClickEvent = (event: ExpectedAny) => {
		// This disable right click on the broswer (when developing in browser)
		event.preventDefault();

		// Attributes
		const type = event.target.getAttribute('data-type');

		// Is not a weapon.
		if (!type || (type && type !== 'weapon::equipped-slot')) return false;

		// Get the slot number..
		const slot = event.target.getAttribute('data-id');

		removeWeaponFromSlot(parseInt(slot));
	};

	useEffect(() => {
		document.addEventListener('contextmenu', onRightClickEvent);

		return () => {
			document.removeEventListener('contextmenu', onRightClickEvent);
		};
	}, []);

	return (
		<React.Fragment>
			<div className={`weapons   ${isDarkEnvironment && 'night'}`}>
				<div className="entries grid-items-framework grid-weapons">
					{[1, 2, 3, 4].map((slotNumber) => (
						<WeaponSlot
							key={slotNumber}
							// The weapon slot number
							slotNumber={slotNumber}
							// The data about this weapon in that slot.
							data={getWeaponFromSlot(slotNumber)}
						/>
					))}
				</div>
				<div className="heading">
					<div className="label">{lang.get('WeaponsHeading')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
