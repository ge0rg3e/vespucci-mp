import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Dependencies
import { createComponentLanguage, getComponentLanguage, makeEndpointRequest } from '@/utils/helpers';
import { createAmplitudeEvent } from '@/utils/amplitude';
import { AppContext } from '@/utils/context';

// Components
import { Button, ButtonBase } from '@mui/material';
import GroupLabel from '@components/groupLabel';
import Username from '@components/username';
import Avatar from '@components/avatar';

// Language
import ComponentLanguage from './userNavigation.language';
const LanguagePack = createComponentLanguage(`layout.topbar.userNavigation`, ComponentLanguage);

const Component = (props: ExpectedAny) => {
	const { account, setAccount } = AppContext();
	const [menuItems, setMenuItems] = useState<ExpectedAny>([]);
	const lang = getComponentLanguage(LanguagePack);

	// Dependencies
	const router = useRouter();

	const logOut = async () => {
		await makeEndpointRequest('auth/logout', 'GET');

		await router.push('/');

		setAccount(null);
	};

	const logIn = async () => {
		localStorage.setItem('@redirectAfterAuthTo', router.asPath);
		await createAmplitudeEvent('Selected "Sign In"');
		router.push('/authentication');
	};

	const getMenuItems = () => {
		const arr = [];

		// Profile
		arr.push({
			id: 'profile',
			icon: `fa-solid fa-user`,
			onClick: () => router.push(`/profiles/${account.username}`)
		});

		arr.push({
			id: 'accountSettings',
			icon: `fa-solid fa-gear`,
			onClick: () => router.push('/settings')
		});

		arr.push({
			id: 'signOut',
			onClick: logOut,
			icon: `fa-solid fa-right-from-bracket`
		});

		return arr;
	};

	useEffect(() => {
		// @Reminder: Bugfix for https://nextjs.org/docs/messages/react-hydration-error
		setMenuItems(getMenuItems());
		// eslint-disable-next-line
	}, [account]);

	const openMenu = async () => {
		props.setDropdownMenuId(props.dropdownMenuId === 'userNavigation' ? null : 'userNavigation');
		props.setSiteNavigationOpened(false);
	};

	return (
		<React.Fragment>
			{account ? (
				<React.Fragment>
					<div className="layout-user-area">
						<ButtonBase className="content" onClick={openMenu}>
							<Avatar username={account.username} type="circular" size="small" />
						</ButtonBase>
						<div className={`layout-user-menu ${props.dropdownMenuId === 'userNavigation' ? 'opened' : 'not-opened'}`}>
							<div className="header">
								<div className="arrow-up"></div>
								<div className="avatar-area">
									<Avatar className="avatar" username={account.username} type="circular" size="medium" redirect={true} />
								</div>
								<div className="details">
									<Username className="username" account={account} redirect={true} />
									<div className="role">
										<GroupLabel account={account} />
									</div>
								</div>
							</div>
							<div className="menu-items">
								{menuItems.map((entry: ExpectedAny, ix: number) => (
									<ButtonBase className="entry" key={ix} onClick={entry.onClick}>
										<div className="icon">
											<i className={`elm ${entry.icon}`}></i>
										</div>
										<div className="label">{lang.get(entry.id)}</div>
									</ButtonBase>
								))}
							</div>
						</div>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
					<div className="buttons">
						<Button variant="contained" color="primary" onClick={logIn}>
							{lang.get('Login')}
						</Button>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

export default Component;
