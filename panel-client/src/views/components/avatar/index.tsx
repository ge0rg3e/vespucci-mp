import { useRouter } from 'next/router';
import React from 'react';

// Dependencies
import { Props } from './types';

const Component = (props: Props) => {
	const router = useRouter();

	const onClick = () => {
		if (props.onClick) return props.onClick();
		if (props.redirect) return router.push(`/profiles/${props.username}`);
		return true;
	};

	if (props.type === 'circular') {
		return (
			<React.Fragment>
				<img
					className={`component-avatar avatar variant-circular size-${props.size} ${props.className || ''} ${props.redirect && 'has-redirect'}`}
					onClick={onClick}
					src={`/assets/images/components/avatar/default.png`}
					alt={`${props.username}'s Avatar`}
				/>
			</React.Fragment>
		);
	}

	return null;
};

export default Component;
