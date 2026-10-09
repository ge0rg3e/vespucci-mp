import React, { useEffect, useState } from 'react';
import { PageState } from '../..';

// Dependencies
import VehicleColors from '../../../../../utils/definitions/vehicleColors';

// Components
import Date from '@components/date';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.vehicles', ComponentLanguages);

const Component = () => {
	const { data } = PageState();
	const [loadImage, setLoadImage] = useState(false);
	const lang = getComponentLanguage(TranslationPack);

	// @Bugfix: In order for "onError" to work we need this.
	useEffect(() => setLoadImage(true), []);

	const capitalizeFunc = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

	const getPainting = (entry: ExpectedAny) => {
		const values = entry.modifications.colors.values;
		const type = entry.modifications.colors.type;

		if (type === 'normal') {
			const main = VehicleColors.find((e: ExpectedAny) => e.id === values[0]);
			if (!main) return 'Unknown';
			return `${capitalizeFunc(main.type)}`;
		} else return 'Normal';
	};

	const getColor = (entry: ExpectedAny, index: number) => {
		const values = entry.modifications.colors.values;

		// The main primary color
		if (index === 1) {
			if (entry.modifications.colors.type === 'rgb') {
				return `rgb(${values[0][0]}, ${values[0][1]}, ${values[0][2]})`;
			} else {
				const main = VehicleColors.find((e: ExpectedAny) => e.id === values[0]);
				if (!main) return null;
				return `${main.hex}`;
			}
		} else {
			if (entry.modifications.colors.type === 'rgb') {
				return `rgb(${values[1][0]}, ${values[1][1]}, ${values[1][2]})`;
			} else {
				const secondary = VehicleColors.find((e: ExpectedAny) => e.id === values[1]);
				if (!secondary) return null;
				return `${secondary.hex}`;
			}
		}
	};
	return (
		<React.Fragment>
			<div className="block-vehicles">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="entries">
						{data.vehicles.map((entry: ExpectedAny, index: number) => (
							<div className={`entry`} key={index}>
								<div className="content">
									<div className="top-right">
										<div className="badge">ID: {entry.id}</div>
									</div>

									<div className={`header component-rarity-glowing --option-glow-left common`}>
										<div className="image-container">
											{loadImage && (
												<img
													onError={(ev: UndefinedAny) => (ev.target.src = `${process.env.NEXT_PUBLIC_ASSETS_PATH}/vehicles/404.png`)}
													onContextMenu={(e) => e.preventDefault()}
													onDragStart={(e) => e.preventDefault()}
													src={`${process.env.NEXT_PUBLIC_ASSETS_PATH}/vehicles/${entry.model}.png`}
													alt={entry.model}
													className="image"
												/>
											)}
										</div>

										<div className="model">{entry.displayName}</div>
									</div>

									<div className="details">
										<div className="line">
											<div className="label">{lang.get('details:Status')}</div>
											<div className="value">
												{entry.status === 0
													? lang.get('status:NotSpawned')
													: entry.status === '1'
													? lang.get('status:Spawned')
													: lang.get('status:InGarage', { id: entry.garageId })}{' '}
											</div>
										</div>
										<div className="line odometer">
											<div className="label">{lang.get('details:Odometer')}</div>
											<div className="value">{entry.odometer.toFixed()} KM</div>
										</div>

										<div className="line">
											<div className="label">{lang.get('details:PurchasedAt')}</div>
											<div className="value"></div>
											<div className="value">
												<Date data={entry.createdAt} format="fullDate" />
											</div>
										</div>

										<div className="line">
											<div className="label">{lang.get('details:Painting')}</div>
											<div className="value">{getPainting(entry)}</div>
										</div>

										<div className="line">
											<div className="label">{lang.get('details:Colors')}</div>
											<div className="value">
												<div className="color-format">
													<span className="color" style={{ background: `${getColor(entry, 1)}` }} />
													<span className="color" style={{ background: `${getColor(entry, 2)}` }} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{data.vehicles.length < 1 && <div className="no-entries">{lang.get('noVehicles')}</div>}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
