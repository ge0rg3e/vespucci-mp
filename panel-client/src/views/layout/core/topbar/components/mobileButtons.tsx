import { useRouter } from 'next/router';
import React from 'react';

const Component = (props: ExpectedAny) => {
	const router = useRouter();

	const switchSiteNavigation = () => {
		props.setSiteNavigationOpened(!props.siteNavigationOpened);
		props.setDropdownMenuId(null);

		if (props.userNavigationOpened) {
			props.setDropdownMenuId(null);
			props.setUserNavigationOpened(false);
		}
	};

	const switchUserNavigation = () => {
		props.setUserNavigationOpened(!props.userNavigationOpened);
		props.setDropdownMenuId(null);

		if (props.siteNavigationOpened) {
			props.setSiteNavigationOpened(false);
		}
	};

	const goHome = () => {
		router.push('/');
	};

	return (
		<React.Fragment>
			<div className="mobile-logo" onClick={goHome}>
				<div className="icon">
					<i className="elm fa-regular fa-tree-palm"></i>
				</div>
			</div>

			<div className={`mobile-navigation-button ${props.siteNavigationOpened ? 'opened' : 'closed'}`} onClick={switchSiteNavigation}>
				<div className="icon">
					<i key={`switchMobileButton-${props.siteNavigationOpened ? 'true' : 'false'}`} className={`elm ${props.siteNavigationOpened ? 'fa-solid fa-xmark' : 'fa fa-fw fa-bars'}`}></i>
				</div>
			</div>

			<div className="mobile-user-navigation">
				<div className={`mobile-button ${props.siteNavigationOpened ? 'opened' : 'closed'}`} onClick={switchUserNavigation}>
					<div className="icon">
						<i key={`switchMobileButton-${props.siteNavigationOpened ? 'true' : 'false'}`} className={`elm fa-solid fa-ellipsis-vertical`}></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
