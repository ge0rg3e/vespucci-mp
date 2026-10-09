import { AppContext } from '@/utils/context';
import React from 'react';

// Componnets
import Header from './components/header';
import Actions from './components/actions';
import Fields from './components/fields';
import Avatar from './components/avatar';

const Component = () => {
	const { account } = AppContext();

	return (
		<React.Fragment>
			<Header />
			<div className="component-details">
				<div className="--component-container">
					<Avatar name={account.username} />
					<div className="name">{account.username}</div>
					<Actions />
					<Fields />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
