import React from 'react';
import { PageState } from '../../';

// Create the language pack..
import ComponentLanguages from './house.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.house', ComponentLanguages);

const Component = () => {
	const { data } = PageState();
	const lang = getComponentLanguage(TranslationPack);
	const owningHouse = data.houseData ? true : false;

	// If the player does not own a house..
	if (owningHouse === false) {
		return (
			<div className="entry house empty">
				<div className="content">
					<div className="image"></div>
					<div className="details">
						<div className="icon">
							<i className="elm fa-solid fa-house"></i>
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
			<div className="entry house">
				<div className="content">
					<div className="image" style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_ASSETS_PATH}/properties/houseExteriors/${data.houseData.id}.jpg")` }}></div>
					<div className="details">
						<div className="icon">
							<i className="elm fa-solid fa-house"></i>
						</div>
						<div className="identifier">House ID: {data.houseData.id}</div>
						<div className="text">{data.houseData.title}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
