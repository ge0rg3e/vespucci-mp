import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

// Dependencies
import { Props } from './container.types';

// Components
import Topbar from './topbar';
import Sidebar from './sidebar';
import Footer from './footer';
import Breadcrumbs from './breadcrumbs';
import Toasts from '../toasts';
import { useRouter } from 'next/router';

const Component = (props: Props) => {
	const [siteNavigationOpened, setSiteNavigationOpened] = useState(false);
	const [userNavigationOpened, setUserNavigationOpened] = useState(false);

	const [dropdownMenuId, setDropdownMenuId] = useState(null);
	const router = useRouter();

	const navProps = {
		siteNavigationOpened,
		setSiteNavigationOpened,
		dropdownMenuId,
		setDropdownMenuId,
		userNavigationOpened,
		setUserNavigationOpened
	};

	// Ref
	const dropdownMenuIdRef = useRef(null);

	useEffect(() => {
		dropdownMenuIdRef.current = dropdownMenuId;
	}, [dropdownMenuId]);

	// Listeners

	const onClicksDetected = (event: ExpectedAny) => {
		// If is an username redirectable..
		if (event.target.tagName === 'A' && event.target.getAttribute('data-username-redirectable') === 'true') {
			event.preventDefault();
			const username = event.target.href.split('/profiles/')[1];
			router.push(`/profiles/${username}`);
			return false;
		}

		if (dropdownMenuIdRef.current === null) return false;
		const { clientX, clientY } = event;
		const elements = document.elementsFromPoint(clientX, clientY);

		if (dropdownMenuIdRef.current === 'userNavigation') {
			const findClass = elements.find((e) => e.className.includes('layout-user-menu') || e.className.includes('layout-user-area'));
			if (findClass) return false;

			setDropdownMenuId(null);
		} else if (dropdownMenuIdRef.current === 'languages') {
			const findClass = elements.find((e) => e.className.includes('layout-languages-menu') || e.className.includes('layout-language'));
			if (findClass) return false;

			setDropdownMenuId(null);
		}
	};

	useEffect(() => {
		document.addEventListener('click', onClicksDetected);
		return () => {
			document.removeEventListener('click', onClicksDetected);
		};
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>{`Vespucci - ${props.title}`}</title>

				{/* General Meta */}
				{props.meta && (
					<React.Fragment>
						<meta name="description" content={props.meta.description || ''} />
						<meta name="keywords" content={props.meta.keywords || ''} />
						<meta name="author" content={props.meta.author || ''} />
					</React.Fragment>
				)}

				{/* Facebook Social Share */}
				{props.facebookOpenGraph && (
					<React.Fragment>
						<meta property="og:title" content={props.facebookOpenGraph.title || ''} key="ogtitle" />
						<meta property="og:description" content={props.facebookOpenGraph.description || ''} key="ogdesc" />
						{props.facebookOpenGraph.image && (
							<React.Fragment>
								<meta property="og:image" content={props.facebookOpenGraph.image.url} key="ogimage" />
								<meta property="og:image:width" content={`${props.facebookOpenGraph.image.width}`} />
								<meta property="og:image:height" content={`${props.facebookOpenGraph.image.height}`} />
							</React.Fragment>
						)}
					</React.Fragment>
				)}
			</Head>
			<div className="layout-document-body">
				<Toasts />

				{!props.withoutLayout ? (
					<React.Fragment>
						<Topbar {...navProps} />
						<div className={`layout-page-body ${props.classNames || ''}`}>
							<Sidebar {...navProps} />
							<div className="layout-page-container comp-tpb-pAdjuster">
								<div className="layout-content">
									<Breadcrumbs data={props.breadcrumbs} />
									{props.children}
								</div>
								<Footer />
							</div>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className={`layout-page-body full-width ${props.classNames || ''}`}>
							<div className="layout-page-container">
								<div className="layout-content">{props.children}</div>
							</div>
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
