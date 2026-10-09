import React from 'react';

// Components
import Videos from './videos';
import Music from './music';

const Component = (props: ExpectedAny) => {
	return (
		<React.Fragment>
			<Videos>
				<Music>{props.children}</Music>
			</Videos>
		</React.Fragment>
	);
};

export default Component;
