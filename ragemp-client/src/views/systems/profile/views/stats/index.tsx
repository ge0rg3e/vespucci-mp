import { ProfileState } from '../..';

// Components
import Information from './components/information';
import Properties from './components/properties';
import Membership from './components/membership';
import Licenses from './components/licenses';
import Vehicles from './components/vehicles';

// Language

import * as i18n from '@vmp/i18n';
import Language from './index.language';

const languagePackId = `SYSTEM_PROFILE_STATS`;
i18n.createLanguagePack(languagePackId, Language);

const Stats = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	return (
		<div className="stats">
			<div className="left-side">
				<div className="header">
					<div className="name">
						{data.remoteInfo.username} ({data.remoteInfo.id}){' '}
						{data.localId !== data.remoteId
							? lang.get('CheckingAs', { name: data.localInfo.username })
							: ''}
					</div>
				</div>
				<Information />
			</div>
			<div className="right-side">
				<Properties />
				<Membership />
				<Vehicles />
				<Licenses />
			</div>
		</div>
	);
};

export default Stats;
