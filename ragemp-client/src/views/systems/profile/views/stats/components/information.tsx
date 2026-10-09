import { formatNumber, formatPhoneNumber } from '@/utils/helpers';
import moment from 'moment';
import React from 'react';
import { ProfileState } from '../../../index';

// Language
import * as i18n from '@vmp/i18n';
import Language from './information.language';
const languagePackId = `SYSTEM_PROFILE_STATS_INFORMATION`;
i18n.createLanguagePack(languagePackId, Language);

const ExportingComponent = () => {
	const { data } = ProfileState();
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const entries = [
		{
			label: lang.get(`Level`),
			value: data.remoteInfo.level
		},
		{
			label: lang.get('Experience'),
			value: `${data.remoteInfo.experience}/${data.remoteExtras.experience_required} XP`
		},
		{
			label: lang.get('Money'),
			value: formatNumber(data.remoteInfo.money, true)
		},
		{
			label: lang.get('Job'),
			value:
				data.remoteInfo.job === 0
					? lang.get('Unemployed')
					: `Raw ID: ${data.remoteInfo.job}`
		},
		{
			label: lang.get('Faction'),
			value: lang.get('Civillian')
		},
		{
			label: lang.get('PhoneNumber'),
			value:
				data.remoteInfo.phoneNumber.length < 1
					? `-`
					: `${formatPhoneNumber(data.remoteInfo.phoneNumber)}`
		},
		{
			label: lang.get('PlayingHours'),
			value:
				data.remoteInfo.connectedTime > 0
					? `${data.remoteInfo.connectedTime} ${lang.get('Hours')}`
					: '-'
		},
		{
			label: lang.get('SessionTime'),
			value:
				data.remoteExtras.sessionTime > 0
					? `${data.remoteExtras.sessionTime} ${lang.get('Minutes')}`
					: '-'
		},
		{
			label: lang.get('CreatedAt'),
			value: moment(data.remoteInfo.createdAt).format(`DD MMMM YYYY, HH:mm`)
		},
		{
			label: 'Admin',
			value: `${data.remoteExtras.developer ? `Maximum` : data.remoteExtras.admin}`,
			hidden: data.remoteExtras.admin === 0
		},
		{
			label: 'Developer',
			value: `Yes`,
			hidden: data.remoteExtras.developer === false
		},
		{
			label: lang.get(`Warns`),
			value: `${data.remoteInfo.warns}/3`
		},
		{
			label: lang.get('Dimension'),
			value: `${data.remoteExtras.dimension}`
		}
	];

	return (
		<React.Fragment>
			<div className="stats-listed">
				{entries
					.filter((s) => s.hidden !== true)
					.map((entry, index) => (
						<div key={index} className="entry">
							<div className="label">{entry.label}</div>
							<div className="value">
								{entry.value !== undefined ? entry.value : `None`}
							</div>
						</div>
					))}
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
