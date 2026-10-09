import { AppContext } from '@/utils/context';
import React from 'react';

const Component = (props: Props) => {
	const { isDarkEnvironment } = AppContext();

	return (
		<React.Fragment>
			<div className={`entry ${props.id} ${isDarkEnvironment && 'dark-mode'}`}>
				<div className="value" style={{ width: `${props.proccent}%` }}></div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	id: 'hp' | 'armour';
	proccent: number;
};

export default Component;
