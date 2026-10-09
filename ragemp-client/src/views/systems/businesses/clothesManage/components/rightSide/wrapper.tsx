import React, { useEffect, useState } from 'react';

// Components
import Forms from './forms';
import Actions from './actions';
import { Tabs, Tab } from '@mui/material';
import { ComponentState } from '../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './wrapper.language';
const LanguageSystemId = 'clothesManagement:RightSide:Tabs';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { texturesFound, settings } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);
	const [textureIds, setTextureIds] = useState([]);

	const [tab, setTab] = useState('data');

	useEffect(() => {
		setTab('data'); // item selected is changed.
	}, [textureIds]);

	useEffect(() => {
		const newIds = texturesFound.map((i: Clothes) => i.id);
		if (JSON.stringify(newIds) !== JSON.stringify(textureIds)) {
			setTextureIds(newIds);
		}
	}, [texturesFound]);

	useEffect(() => {
		if (settings.advancedEditing === false && tab === 'advanced') {
			setTab('data');
		}
	}, [settings.advancedEditing]);

	return (
		<React.Fragment>
			<div className="right-side">
				<div className="wrapper">
					<TabsComponent lang={lang} value={tab} setValue={setTab} />
					<div className="scroll-container">
						{tab === 'data' && <Forms advanced={false} />}
						{tab === 'advanced' && <Forms advanced={true} />}
						{tab === 'actions' && <Actions />}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const TabsComponent = (props: ExpectedAny) => {
	const { data, settings } = ComponentState();

	return (
		<Tabs
			className="tabs"
			value={props.value}
			onChange={(_, value) => props.setValue(value)}
			variant="fullWidth"
		>
			<Tab value={'data'} label={props.lang.get('Details')} />

			<Tab
				value="actions"
				disabled={!data.permissions.update}
				label={props.lang.get('Actions')}
			/>
			{settings.advancedEditing && <Tab value={'advanced'} label={props.lang.get('Dev')} />}
		</Tabs>
	);
};

export default Component;
