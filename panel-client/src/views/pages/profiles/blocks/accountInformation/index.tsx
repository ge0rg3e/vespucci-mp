import { formatNumber, createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { PageState } from '../..';
import React from 'react';

// Create the language pack..
import ComponentLanguages from './index.languages';
const TranslationPack = createComponentLanguage('profiles.accountInformation', ComponentLanguages);

const Component = () => {
	const { data } = PageState();

	const lang = getComponentLanguage(TranslationPack);

	const fields = [
		// {
		// 	id: 'level',
		// 	value: 5,
		// 	icon: 'fa-sharp fa-solid fa-water-arrow-up'
		// },
		{
			id: 'cash',
			value: formatNumber(data.money, true),
			icon: 'fa-solid fa-wallet'
		},
		{
			id: 'bank',
			value: formatNumber(0, true),
			icon: 'fa-solid fa-credit-card'
		},
		{
			id: 'job',
			value: 'None',
			icon: 'fa-solid fa-briefcase'
		},
		// {
		// 	id: 'faction',
		// 	value: 'Los Santos Police Department (Rank 3)',
		// 	icon: 'fa-solid fa-sitemap'
		// },
		{
			id: 'gang',
			value: 'None',
			icon: 'fa-solid fa-person-rifle'
		},

		// {
		// 	id: 'playingTime',
		// 	value: '234 Hours',
		// 	icon: 'fa-solid fa-clock'
		// },
		{
			id: 'phoneNumber',
			value: data.phoneNumber || 'None',
			icon: 'fa-solid fa-solid fa-mobile-notch'
		},
		{
			id: 'referralID',
			value: data.id,
			icon: 'fa-solid fa-regular fa-user-group'
		},
		{
			id: 'warns',
			value: `${data.warns}/3`,
			icon: 'fa-solid fa-triangle-exclamation'
		},
		{
			id: 'factionWarns',
			value: '0/3',
			icon: 'fa-solid fa-triangle-exclamation'
		},
		{
			id: 'factionPunish',
			value: '0',
			icon: 'fa-solid fa-solid fa-do-not-enter'
		}
	];

	return (
		<React.Fragment>
			<div className="block-information account-information">
				<div className="content">
					<div className="component-heading">{lang.get('heading')}</div>

					<div className="entries">
						{fields.map((entry, ix) => (
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
