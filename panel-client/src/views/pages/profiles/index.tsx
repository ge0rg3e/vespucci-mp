import React, { createContext, useContext, useEffect } from 'react';

// Dependencies
import Container from '@/views/layout/core/container';
import { Props } from './types';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { createAmplitudeEvent } from '@/utils/amplitude';

const TranslationPack = createComponentLanguage('profiles.main', ComponentLanguages);

// Widgets
import Vouchers from './widgets/vouchers';
import Details from './widgets/details';

// Components
import AccountInformation from './blocks/accountInformation';
import PrivateInformation from './blocks/privateInformation';
import Business from './blocks/properties/business';
import House from './blocks/properties/house';
import Skills from './blocks/skills';
import Actions from './blocks/actions';
import Crates from './blocks/crates';
import Vehicles from './blocks/vehicles';
import Appearance from './blocks/appearance';
import InventoryStats from './blocks/inventoryStats';
import Outfits from './blocks/outfits';

// Context
const Context = createContext({});
export const PageState: ExpectedAny = () => useContext(Context);

const Component = (props: Props) => {
	const lang = getComponentLanguage(TranslationPack);

	const breadcrumbs = [
		{
			shortcut: 'home'
		},
		{
			label: lang.get('breadcrumb', { player: props.data.username }),
			icon: 'fa-solid fa-user',
			href: `/profiles/${props.data.username}`
		}
	];

	const contextPassed = {
		data: props.data
	};

	useEffect(() => {
		createAmplitudeEvent(`Profiles`, { username: props.data.username });
		// eslint-disable-next-line
	}, []);

	return (
		<Container title={lang.get('seoTitle', { player: props.data.username })} classNames="page-profiles" breadcrumbs={breadcrumbs}>
			<Context.Provider value={contextPassed}>
				<div className="page-layout">
					<div className="page-layout-left-side">
						<Details />
						<Vouchers />
					</div>
					<div className="page-layout-right-side">
						<AccountInformation />
						<div className="block-properties">
							<House />
							<Business />
						</div>
						<PrivateInformation />
						<Actions />
						<Skills />

						<div className="component-layout-inventory">
							<div className="--layout-left">
								<Appearance />
							</div>
							<div className="--layout-right">
								<div className="--contents">
									<InventoryStats />
									<Outfits />
								</div>
							</div>
						</div>
						<Crates />
						<Vehicles />
					</div>
				</div>
			</Context.Provider>
		</Container>
	);
};

export default Component;
