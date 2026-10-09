import React from 'react';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.crates', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	const entries: ExpectedAny = [
		// {
		// 	id: 1,
		// 	name: 'Death Crate',
		// 	quantity: 0
		// }
		// {
		// 	id: 2,
		// 	name: 'Doge Crate',
		// 	quantity: 0
		// },
		// {
		// 	id: 3,
		// 	name: 'Gucci Crate',
		// 	quantity: 0
		// },
		// {
		// 	id: 3,
		// 	name: 'Gucci Crate',
		// 	quantity: 0
		// },
		// {
		// 	id: 3,
		// 	name: 'Gucci Crate',
		// 	quantity: 0
		// },
		// {
		// 	id: 3,
		// 	name: 'Gucci Crate',
		// 	quantity: 0
		// }
		// {
		// 	id: 3,
		// 	name: 'Gucci Crate',
		// 	quantity: 0
		// }
	];

	return (
		<React.Fragment>
			<div className="block-crates">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="entries">
						{entries.map((entry: ExpectedAny, ix: number) => (
							<div className={`entry`} key={ix}>
								<div className={`content`}>
									<div className="image" style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_ASSETS_PATH}/crates/${entry.id}.png")` }}></div>
									<div className="details">
										<div className="name">{entry.name}</div>
										<div className="amount">{entry.quantity}</div>
									</div>
								</div>
							</div>
						))}
					</div>
					{entries.length < 1 && <div className="no-entries">{lang.get('noCrates')}</div>}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
