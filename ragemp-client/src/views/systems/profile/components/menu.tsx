import { createAmplitudeEvent } from '@/utils/helpers';
import React from 'react';
import { ProfileState } from '../index';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LoginLanguage from './menu.language';
const languagePackId = `SYSTEM_PROFILE_MENU`;
i18n.createLanguagePack(languagePackId, LoginLanguage);

const ExportingComponent = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const { route, setRoute, data } = ProfileState();

	const entries = [
		{
			label: lang.get('StatsLabel'),
			key: 'stats'
		},
		{
			label: lang.get('JobLabel'),
			key: 'jobStats',
			notDeveloped: true
		},
		{
			label: lang.get('FactionLabel'),
			key: 'factionStats',
			notDeveloped: true
		},
		{
			label: lang.get('StoryLabel'),
			key: 'storyStats',
			notDeveloped: true
		},
		{
			label: lang.get('AchievementsLabel'),
			key: 'achievements',
			notDeveloped: true
		},
		{
			label: lang.get('ShopLabel'),
			key: 'shop',
			notDeveloped: true,
			disabled: data.localId !== data.remoteId
		}
	];

	const onRouteClicked = async (entry: UndefinedAny) => {
		if (entry.notDeveloped) return window.toast({ type: 'error', message: `This option is disabled for now.` });
		await createAmplitudeEvent(`Selected Item from Navigation`, {
			item: entry.label,
			value: entry.key
		});
		setRoute(entry.key);
	};

	return (
		<React.Fragment>
			<div className="body-menu">
				{entries.map((entry, index) => (
					<div
						className={`entry ${route === entry.key && `active`} ${entry.disabled && `disabled`}`}
						key={index}
						onClick={() => onRouteClicked(entry)}
					>
						{entry.label}
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
