import { ComponentState } from '@/views/systems/inventory';
import React, { useState, useEffect } from 'react';

const Component = (props: ExpectedAny) => {
	const { data, lang, isDarkEnvironment, activeDragId, activeDragType } = ComponentState();

	const [isClothingDragged, setIsClothingDragged] = useState(false);

	useEffect(() => {
		setIsClothingDragged(activeDragId === props.type && activeDragType === `clothing` ? true : false);
	}, [activeDragId, activeDragType]);

	return (
		<React.Fragment>
			<div
				className={`entry ${props.type} ${isDarkEnvironment && `night`}`}
				data-type={data.remoteClothes[props.type] ? `clothing` : `empty-clothing`}
				data-clothes-type={props.type}
				data-draggable={'true'}
				data-id={`${props.type}`}
				draggable={true}
				id={`clothing-${props.type}`}
			>
				<div
					className={`content  ${data.remoteClothes[props.type] && !isClothingDragged ? 'filled' : 'empty'} ${
						props.type === 'blank' && 'blank'
					}`}
				>
					{props.type !== 'blank' ? (
						<React.Fragment>
							{data.remoteClothes[props.type] && !isClothingDragged ? (
								<React.Fragment>
									<img
										className={`image ${props.type} grid-image-size`}
										onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
										onError={(ev: UndefinedAny) =>
											(ev.target.src = `/assets/images/systems/inventory/clothes/${props.type}.png`)
										}
										onContextMenu={(e) => e.preventDefault()}
										onDragStart={(e) => e.preventDefault()}
										onClick={() => setIsClothingDragged(true)}
										src={`${__ASSETS__}/clothes/${data.remoteClothes[props.type]}.png`}
									/>
									<div className="hidden-background"></div>
								</React.Fragment>
							) : (
								<React.Fragment>
									<img
										className={`image ${props.type} is-empty grid-image-size is-placeholder-clothing`}
										onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
										onContextMenu={(e) => e.preventDefault()}
										onDragStart={(e) => e.preventDefault()}
										src={`/assets/images/systems/inventory/emptyClothes/${props.type}.png`}
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
