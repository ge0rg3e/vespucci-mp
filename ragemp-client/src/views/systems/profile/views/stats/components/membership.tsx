import React from 'react';
import { ProfileState } from '../../..';
import { createAmplitudeEvent } from '@/utils/helpers';

// Components
import { Button } from '@mui/material';

// Language
import * as i18n from '@vmp/i18n';
import Language from './membership.langauge';
const languagePackId = `SYSTEM_PROFILE_MEMBERSHIP`;
i18n.createLanguagePack(languagePackId, Language);

const ExportingComponent = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const getRewards = async () => {
		return window.toast({ type: 'info', message: `This feature will be added later` });
		await createAmplitudeEvent(`Selected "Get Rewards"`, {});
	};
	return (
		<React.Fragment>
			<div className="two-grid-rows faction-and-referrals">
				<div className="grid-entry faction">
					<img
						src={`/assets/images/systems/profile/stats/factions/civillian.png`}
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image`}
					/>

					<div className="content">
						{/* <div className="rank">Rank 4</div> */}
						<div className="name">{lang.get('Civillians')}</div>
						<div className="history">{lang.get('NotPartOfFaction')} </div>
					</div>
				</div>
				<div className="grid-entry referrals">
					<img
						src={`/assets/images/systems/profile/stats/referrals.png`}
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`image`}
					/>

					<div className="content">
						<div className="title">{lang.get('Referrals')}</div>
						<div className="actives">{lang.get('ActiveReferrals', { value: 0 })}</div>
						<Button
							disabled={data.remoteId !== data.localId}
							className="button"
							variant="contained"
							onClick={getRewards}
						>
							{lang.get('HowToGetRewards')}
						</Button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
