import React from 'react';
import { PageState } from '../..';

// Components
import Img from '@components/img';

// Dependencies
import { getComponentLanguage, createComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './language';

// Create the language pack..
const TranslationPack = createComponentLanguage('homepage.properties', ComponentLanguages);

const Component = () => {
	const { metrics } = PageState();
	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="properties">
				<div className="entry">
					<div className="content">
						<div className="label">{lang.get('Businesses')}</div>
						<div className="value">{metrics.businesses}</div>
					</div>
					<div className="icon">
						<Img src="/assets/images/pages/home/business.png" width="30px" height="30px" alt="Business Icon" />
					</div>
				</div>

				<div className="entry">
					<div className="content">
						<div className="label">{lang.get('Houses')}</div>
						<div className="value">{metrics.houses}</div>
					</div>
					<div className="icon">
						<Img src="/assets/images/pages/home/house.png" width="30px" height="30px" alt="House Icon" />
					</div>
				</div>

				<div className="entry">
					<div className="content">
						<div className="label">{lang.get('Vehicles')}</div>
						<div className="value">{metrics.vehicles}</div>
					</div>
					<div className="icon">
						<Img src="/assets/images/pages/home/vehicle.png" width="30px" height="30px" alt="Vehicle Icon" />
					</div>
				</div>

				<div className="entry">
					<div className="content">
						<div className="label">{lang.get('Gangs')}</div>
						<div className="value">{metrics.gangs}</div>
					</div>
					<div className="icon">
						<Img src="/assets/images/pages/home/gun.png" width="30px" height="30px" alt="Gang Icon" />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
