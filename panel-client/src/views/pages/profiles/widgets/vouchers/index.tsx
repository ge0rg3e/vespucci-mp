import React from 'react';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.vouchers', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	const entries = [
		{
			className: 'common',
			rarityName: 'Common',
			activityPoints: 5,
			amount: 0
		},
		{
			className: 'uncommon',
			rarityName: 'Uncommon',
			activityPoints: 20,
			amount: 0
		},

		{
			className: 'rare',
			rarityName: 'Rare',
			activityPoints: 50,
			amount: 0
		},
		{
			className: 'epic',
			rarityName: 'Epic',
			activityPoints: 100,
			amount: 0
		},

		{
			className: 'legendary',
			rarityName: 'Legendary',
			activityPoints: 250,
			amount: 0
		},
		{
			className: 'mythic',
			rarityName: 'Mythic',
			activityPoints: 500,
			amount: 0
		},
		{
			className: 'celestial',
			rarityName: 'Celestial',
			activityPoints: 1000,
			amount: 0
		}
	];

	return (
		<React.Fragment>
			<div className="widget-vouchers">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="entries">
						{entries.map((entry, ix) => (
							<div className={`entry`} key={ix}>
								<div className={`content component-rarity-glowing --option-glow-left ${entry.className}`}>
									<div
										className="image"
										style={{
											backgroundImage: `url("/assets/images/pages/profiles/vouchers/${entry.className}.png")`
										}}
									></div>
									<div className="details">
										<div className={`component-rarity-texts ${entry.className} rarity`}>{entry.rarityName}</div>
										<div className="points">{entry.activityPoints} AP</div>
									</div>
									<div className="amount">{entry.amount}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
