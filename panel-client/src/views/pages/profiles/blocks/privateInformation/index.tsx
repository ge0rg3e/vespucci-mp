import { createComponentLanguage, formatNumber, getComponentLanguage } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { PageState } from '../..';

// Dependencies
import { checkAccountPermission } from '@/utils/permissions';
import { AppContext } from '@/utils/context';
import donorTiersLabels from '@/utils/definitions/donorTiers';

// Create the language pack..
import ComponentLanguages from './index.languages';
const TranslationPack = createComponentLanguage('profiles.privateInformation', ComponentLanguages);

const Component = () => {
	const { data } = PageState();
	const { account } = AppContext();
	const lang = getComponentLanguage(TranslationPack);
	const [permissionGranted, setPermissionGranted] = useState(false);

	const fields = [
		{
			id: 'membership',
			value: data.donorTier > 0 ? `Tier ${data.donorTier} - ${donorTiersLabels[data.donorTier]}` : 'None',
			icon: 'fa-regular fa-martini-glass'
		},
		// data.donorTier > 0
		// 	? {
		// 			id: 'expiration',
		// 			value: `Expires on 25th February 1998, 20:30`,
		// 			icon: 'fa-solid fa-calendar-clock'
		// 			// eslint-disable-next-line no-mixed-spaces-and-tabs
		// 	  }
		// 	: null,
		{
			id: 'beachCoins',
			value: `${formatNumber(data.beachCoins)} BC`,
			icon: 'fa-solid fa-umbrella-beach'
		},
		{
			id: 'points',
			value: `${formatNumber(0)} AP`,
			icon: 'fa-solid fa-coin-vertical'
		},

		{
			id: 'email',
			value: data.email,
			icon: 'fa-solid fa-envelope'
		}
	].filter((e) => e !== null);

	// @Bugfix: Next.js due to Hydration errors we cannot do this otherwise.
	// We need to check if they have permission to see only within useEffect.
	useEffect(() => {
		setPermissionGranted(checkAccountPermission(account, 'profiles.seePrivateInformation'));
		// eslint-disable-next-line
	}, []);

	if (!permissionGranted) return null;

	return (
		<React.Fragment>
			<div className="block-information private-information">
				<div className="content">
					<div className="component-heading">Private Information</div>

					<div className="entries">
						{fields.map((entry: ExpectedAny, ix: number) => (
							<div className={`entry`} key={ix}>
								<div className="icon">
									<i className={`elm ${entry.icon}`}></i>
								</div>
								<div className="label">{lang.get(entry.id)}</div>
								<div className="value">{entry.value}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
