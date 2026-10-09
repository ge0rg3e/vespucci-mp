import React, { useEffect, useState } from 'react';

// Create the language pack..
import ComponentLanguages from './clothing.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.clothing', ComponentLanguages);

const Component = (props: ExpectedAny) => {
	const [loadImage, setLoadImage] = useState(false);

	// The language..
	const lang = getComponentLanguage(TranslationPack);

	// @Bugfix to Next.js not allowing the onError.
	useEffect(() => setLoadImage(true), []);

	return (
		<React.Fragment>
			<div className={`entry ${props.type}`}>
				<div className={`content ${!props.data[props.type] && 'empty'} ${props.type === 'blank' && 'blank'}`}>
					{props.type !== 'blank' ? (
						<React.Fragment>
							{props.data[props.type] ? (
								<React.Fragment>
									{loadImage && (
										<img
											className={`image ${props.type} grid-image-size`}
											onError={(ev: UndefinedAny) => (ev.target.src = `/assets/images/pages/profiles/inventory/clothes/${props.type}.png`)}
											onContextMenu={(e) => e.preventDefault()}
											onDragStart={(e) => e.preventDefault()}
											src={`${process.env.NEXT_PUBLIC_ASSETS_PATH}/clothes/${props.data[props.type].id}.png`}
											alt="Clothing component"
										/>
									)}
									<div className="hidden-background"></div>
								</React.Fragment>
							) : (
								<React.Fragment>
									<img
										className={`image ${props.type} is-empty grid-image-size is-placeholder-clothing`}
										onContextMenu={(e) => e.preventDefault()}
										onDragStart={(e) => e.preventDefault()}
										src={`/assets/images/pages/profiles/inventory/emptyClothes/${props.type}.png`}
										alt="Clothing component"
									/>
									<div className="label">{lang.get(`Clothes:${props.type}`)}</div>
								</React.Fragment>
							)}
						</React.Fragment>
					) : null}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
