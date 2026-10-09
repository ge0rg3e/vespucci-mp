import React from 'react';
import { ProfileState } from '../../../index';

// Language

import * as i18n from '@vmp/i18n';
import Language from './properties.language';

const languagePackId = `SYSTEM_PROFILE_PROPERTIES`;
i18n.createLanguagePack(languagePackId, Language);

const ExportingComponent = () => {
	const { data } = ProfileState();

	const lang = i18n.getLanguagePack(languagePackId, window.language);

	return (
		<React.Fragment>
			<div className="two-grid-rows owned-properties">
				<div className="grid-entry entry">
					<div className="icon-container">
						<i className="elm fa-solid fa-house"></i>
					</div>
					<div className="details">
						<div className="heading">{lang.get('House')}</div>
						<div className="description">
							{data.remoteInfo.house || data.remoteInfo.houseRent ? (
								<React.Fragment>
									{lang.get(data.remoteInfo.house ? 'YouOwn' : 'YouRent', {
										type: 'house',
										id: data.remoteInfo.house
											? data.remoteInfo.house
											: data.remoteInfo.houseRent
									})}
								</React.Fragment>
							) : (
								<React.Fragment>
									{lang.get('YouDontOwn', { type: `house` })}
								</React.Fragment>
							)}
						</div>
					</div>
				</div>
				<div className="grid-entry entry">
					<div className="icon-container">
						<i className="elm fa-solid fa-buildings"></i>
					</div>
					<div className="details">
						<div className="heading">{lang.get('Business')}</div>
						<div className="description">
							{' '}
							{lang.get(!data.remoteInfo.business ? 'YouDontOwn' : 'YouOwn', {
								type: 'business',
								id: data.remoteInfo.business
							})}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
