import { useRouter } from 'next/router';
import React from 'react';

// Create the language pack..
import ComponentLanguages from './breadcrumbs.lang';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('layout.breadcrumbs.main', ComponentLanguages);

const Component = (props: ExpectedAny) => {
	const router = useRouter();
	const lang = getComponentLanguage(TranslationPack);

	const onClick: ExpectedAny = (ev: ExpectedAny, entry: ExpectedAny) => {
		ev.preventDefault();
		router.push(entry.href);
	};

	const getBreadcrumbs = () => {
		let arr: ExpectedAny = props.data || [];

		arr = arr.map((e: ExpectedAny) => {
			if (!e.shortcut) return e;
			if (e.shortcut === 'home') {
				return {
					label: lang.get('home'),
					href: '/',
					icon: 'fa-solid fa-house'
				};
			}
		});

		return arr;
	};

	// Hiding component if empty
	if (getBreadcrumbs().length < 1) return null;

	return (
		<React.Fragment>
			<div className="layout-breadcrumbs">
				{getBreadcrumbs().map((entry: ExpectedAny, ix: number) => (
					<a className="layout-breadcrumbs-entry" key={ix} href={entry.href} onClick={(ev) => onClick(ev, entry)}>
						<div className="icon">
							<i className={`elm ${entry.icon}`} />
						</div>
						<div className="label">{entry.label}</div>
					</a>
				))}
			</div>
		</React.Fragment>
	);
};
export default Component;
