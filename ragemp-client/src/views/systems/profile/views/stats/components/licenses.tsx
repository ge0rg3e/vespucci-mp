import { ProfileState } from '../../../index';
import React from 'react';

// Language
import * as i18n from '@vmp/i18n';
import Language from './licenses.language';

const languagePackId = `SYSTEM_PROFILE_LICENSES`;
i18n.createLanguagePack(languagePackId, Language);

const ExportingComponent = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const licenses = data.remoteExtras.licenses.filter((c: PlayerLicenses) => c.hours > 0);

	return (
		<React.Fragment>
			<div className="table-profile-wrapper">
				<div className="table-body">
					<div className="table-header table-row">
						<div className="table-cell make">License</div>
						<div className="table-cell distance">Hours</div>
					</div>
					<div className="table-content">
						{licenses.map((license: PlayerLicenses, i: number) => (
							<div key={i} className="table-row">
								<div className="table-cell make">{lang.get(`${license.id}License`)}</div>
								<div className="table-cell distance">{license.hours}</div>
							</div>
						))}
						{data.remoteExtras.licenses.length === 0 && (
							<div className="table-row empty">
								<div className="table-cell empty">{lang.get('NoLicenses')}</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
