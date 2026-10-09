import React from 'react';
import { Tab as TabType } from './tabs.types';
import { ComponentState } from '..';

// Components
import { Tab, Tabs } from '@mui/material';

const Component = () => {
	const { tab, lang, search, setTab, getPlayers } = ComponentState();

	const tabs: Array<TabType> = [
		{
			label: (
				<div className="tab-content">
					<div className="text">{lang.get('AllPlayers')}</div>
				</div>
			),
			value: 'all'
		},
		{
			label: (
				<div className="tab-content">
					{getPlayers('nearby').length > 0 && (
						<span className="badge">{getPlayers('nearby').length}</span>
					)}
					<div className="text">{lang.get('Nearby')}</div>
				</div>
			),
			value: `nearby`
		},
		{
			label: (
				<div className="tab-content">
					{getPlayers('staff').length > 0 && (
						<span className="badge">{getPlayers('staff', search).length}</span>
					)}
					<div className="text">{lang.get('Staff')}</div>
				</div>
			),
			value: `staff`
		}
	];

	return (
		<React.Fragment>
			<div className="tabs">
				<Tabs value={tab} variant="fullWidth" onChange={(_, value) => setTab(value)}>
					{tabs.map((entry: TabType, ix: number) => (
						<Tab key={ix} value={entry.value} label={entry.label} />
					))}
				</Tabs>
			</div>
		</React.Fragment>
	);
};

export default Component;
