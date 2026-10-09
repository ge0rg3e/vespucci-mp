import React from 'react';

// Context
import { ComponentState } from '../../../../../';

// Components
import Respond from './components/respond';
import HangUp from './components/hangUp';

const Component = () => {
	const { localData, participantData } = ComponentState();

	// If participant is now with us | If we are still waiting for him to answer we can hang up.
	if (localData.status === 'active' && ['active', 'pending'].includes(participantData.status))
		return <HangUp />;

	// @Render this only if someone is calling us.
	if (localData.status == 'pending') return <Respond />;

	return null;
};

export default Component;
