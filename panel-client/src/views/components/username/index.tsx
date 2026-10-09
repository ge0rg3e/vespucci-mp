import React from 'react';

import { conditionalClassNames } from '@/utils/helpers';
import { useRouter } from 'next/router';
import { Props } from './types';

const Component = (props: Props) => {
	const router = useRouter();

	const onClick: ExpectedAny = () => {
		router.push(`/profiles/${props.account.username}`);
	};

	const classNames = conditionalClassNames(`component-username ${props.className || ''} component-shared-group-colors ${getSpecialClassNames(props.account)}`, [
		{
			class: 'has-redirect',
			if: props.redirect === true
		}
	]);

	// Used in actions when rendering a component to string..
	if (props.useHref && props.redirect) {
		return (
			<a href={`/profiles/${props.account.username}`} data-username-redirectable={true} className={classNames}>
				{props.account.username}
			</a>
		);
	}
	return (
		<span className={classNames} onClick={() => (props.redirect ? onClick() : undefined)}>
			{props.account.username}
		</span>
	);
};

export const getSpecialClassNames = (account: ExpectedAny) => {
	const vip = account.donorTier;
	const groups = account.groups.split(',').map((e: ExpectedAny) => e.split(':')[0]);
	// const factionId = props.account.factionId;
	// const factionRank = props.account.factionRank;

	if (groups.includes('owner')) return 'owner gradient';
	if (groups.includes('developers')) return 'developers gradient';
	if (groups.includes('admins')) return 'admins';
	if (groups.includes('helpers')) return 'helpers';
	if (vip > 0) return 'donorTier';

	return '';
};

export default Component;
