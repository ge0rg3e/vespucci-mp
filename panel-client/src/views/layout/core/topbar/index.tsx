import React, { useEffect } from 'react';

// Components
import UserNavigation from './components/userNavigation';
import MobileButtons from './components/mobileButtons';
import Languages from './components/languages';

const Component = (props: ExpectedAny) => {
	const onElementClicked = (event: ExpectedAny) => {
		if (event.target && event.target.className === `layout-sidebar-shadow-mobile`) {
			props.setSiteNavigationOpened(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', onElementClicked);
		return () => {
			document.removeEventListener('click', onElementClicked);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<React.Fragment>
			<div className={`layout-topbar ${props.userNavigationOpened ? 'opened-user-navigation' : ''}`}>
				<div className="content">
					<MobileButtons {...props} />
					<div className={`user-navigation ${props.userNavigationOpened ? 'opened' : 'not-opened'}`}>
						<Languages {...props} />
						<div className="separator"></div>
						<UserNavigation {...props} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
