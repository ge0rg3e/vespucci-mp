import { ProfileState } from '..';
import { Button } from '@mui/material';

// Language
import * as i18n from '@vmp/i18n';
import SpecialPointsLanguage from './specialPoints.language';
const languagePackId = `SYSTEM_PROFILE_SPECIAL_POINTS`;
i18n.createLanguagePack(languagePackId, SpecialPointsLanguage);

const ExportingComponent = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const disabledForNow = async () =>
		window.toast({ type: 'info', message: `This feature will be added later` });

	return (
		<div className="body-special-points">
			<div className="count">{data.remoteInfo.beachCoins || 0} Beach Coins</div>
			<Button
				variant="contained"
				color="primary"
				className="button1"
				disabled={data.remoteId !== data.localId}
				onClick={() => disabledForNow()}
				// onClick={() => setRoute('donations')}
			>
				{lang.get('BuyCredits')}
			</Button>
			<Button
				variant="contained"
				color="primary"
				className="button2"
				disabled={data.remoteId !== data.localId}
				onClick={() => disabledForNow()}
				// onClick={() => setRoute('redeem')}
			>
				{lang.get('RedeemCode')}
			</Button>
		</div>
	);
};

export default ExportingComponent;
