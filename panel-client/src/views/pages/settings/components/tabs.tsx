import { Tab, Tabs } from '@mui/material';
import React from 'react';

// Dependencies
import { PageState } from '..';

const Component = () => {
	const { tab, setTab } = PageState();

	return (
		<React.Fragment>
			<Tabs className="tabs" value={tab} onChange={(_, value) => setTab(value)}>
				<Tab label="General" value={'general'} />
				<Tab label="Security" value={'security'} />
			</Tabs>
		</React.Fragment>
	);
};

export default Component;
