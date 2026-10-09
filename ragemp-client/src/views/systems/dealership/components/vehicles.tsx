import { DealershipState } from '..';
import { ButtonBase } from '@mui/material';

// Dependencies
import { formatNumber } from '@/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
import Language from './vehicles.lang';
const languagePackId = `SYSTEM_DEALERSHIP_CATEGORIES_VEHICLES_LIST`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const { getVehicles, vehicleSelected, setVehicleSelected } = DealershipState();

	const selectVehicle = (entry: FixableAny) => setVehicleSelected(entry.id);

	return (
		<div className="entries scroll-styled">
			{getVehicles(true).map((entry: FixableAny, ix: number) => (
				<ButtonBase
					className={`entry ${vehicleSelected === entry.id && 'selected'}`}
					key={ix}
					onClick={() => selectVehicle(entry)}
				>
					<div className="content">
						<div className="details">
							<div className="model">{entry.nativeInfo.displayName}</div>
							<div className="manufacturer">
								{entry.nativeInfo.manufacturerDisplayName}
							</div>
						</div>
						<div className="thumbnail">
							<img
								className={`image`}
								src={`${__ASSETS__}/vehicles/${entry.model}.png`}
								onError={(ev: UndefinedAny) =>
									(ev.target.src = `${__ASSETS__}/vehicles/404.png`)
								}
								onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
							/>
						</div>
					</div>
					<div className="bottom-bar">
						{entry.quantity < 1 ? (
							<div className="badge stock grey">
								{window.language === 'EN' ? 'No' : 'Fără'} stock
							</div>
						) : (
							<div className="badge stock">
								{formatNumber(entry.quantity, false)} in stock
							</div>
						)}
						{/* <div className="badge">VIP ONLY</div> */}
						<div className="price green">{formatNumber(entry.price, true)}</div>
					</div>
				</ButtonBase>
			))}
			{getVehicles(true).length < 1 && (
				<div className="no-results">{lang.get('NoSearchResults')}</div>
			)}
		</div>
	);
};

export default Component;
