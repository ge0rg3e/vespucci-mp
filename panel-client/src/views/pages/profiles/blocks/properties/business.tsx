import React from 'react';
import { PageState } from '../../';

// Create the language pack..
import ComponentLanguages from './business.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.business', ComponentLanguages);

const Component = () => {
	const { data } = PageState();
	const lang = getComponentLanguage(TranslationPack);

	const owningHouse = data.businessData ? true : false;

	// If the player does not own a house..
	if (owningHouse === false) {
		return (
			<div className="entry business empty">
				<div className="content">
					<div className="image"></div>
					<div className="details">
						<div className="icon">
							<i className="elm fa-solid fa-briefcase"></i>
						</div>

						<div className="text">{lang.get('empty')}</div>
					</div>
				</div>
			</div>
		);
	}

	// The player does own a house
	return (
		<React.Fragment>
			<div className="entry business">
				<div className="content">
					<div className="image" style={{ backgroundImage: `url("/assets/images/pages/profiles/properties/business_placeholder.jpg")` }}></div>
					<div className="details">
						<div className="icon">
							<i className="elm fa-solid fa-house"></i>
						</div>
						<div className="identifier">Business ID: {data.businessData.id}</div>
						<div className="text">{businessTypes[data.businessData.type].label}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export const businessTypes: ExpectedAny = [
	{
		id: 1,
		label: 'Clothing Store'
	},
	{
		id: 2,
		label: 'Barber Shop'
	},
	{
		id: 3,
		label: 'Auto Shop'
	},
	{
		id: 4,
		label: 'General Store (24/7)'
	},
	{
		id: 5,
		label: 'Tattoo Parlor'
	},
	{
		id: 6,
		label: 'Gun Store (Ammunation)'
	},
	{
		id: 7,
		label: 'Bank'
	},
	{
		id: 8,
		label: 'Casino'
	},
	{
		id: 9,
		label: 'Lotto'
	},

	{
		id: 10,
		label: 'Bars'
	},

	{
		id: 11,
		label: 'Betting'
	},

	{
		id: 12,
		label: 'CNN'
	}
];

export type BusinessTypes = {
	id: number;
	label: string;
};

export default Component;
