import React from 'react';

// Components
import AppIcon from './components/appIcon';
import Shortcut from './components/shortcut';

// Dependencies
import { PhoneState } from '@phone/index';
import { isNativePhoneRoute } from '../../utils/helpers';
import MapApps from '../../utils/map';

const ExportingComponent = () => {
	const { applications, applicationsSorting, openApplication } = PhoneState();

	const onAppClicked = (app: ExpectedAny, isShortcut: boolean) => {
		if (isShortcut === true && !applications.includes(app.route)) return false;

		openApplication(app);
	};

	const getApplications = () => {
		// Variable to hold the end result
		const arr: FixableAny = [];

		// Getting the list of applications to be listed on his home screen.
		const unlockedApplications = Object.keys(MapApps).filter((key) => {
			// Is a native app therefore it's not meant to be listed on home screen
			if (isNativePhoneRoute(key)) return false;

			// We are on development mode.
			if (window.mp.fake === true) return true;

			// We have access to it and is a valid app.
			if (applications.includes(key) && MapApps[key].label !== undefined) return true;

			return false; // otherwise.
		});

		// Iterating through the apps that we have access through and formatting them.
		unlockedApplications.forEach((key) => {
			// Getting the app object entry from the map of phone apps.
			const app = MapApps[key];

			// Formatting the object
			const newApplication = {
				route: key,
				label: app.label,
				icon: app.icon
			};

			// Do we have an expected sorting number for this app id? (Aka we set it via server-side to be on a specific slot)
			if (applicationsSorting[key] !== undefined) {
				arr.splice(applicationsSorting[key], 0, newApplication);
				return true;
			}

			// If not we just add it.
			arr.push(newApplication);
		});

		return arr;
	};

	return (
		<React.Fragment>
			<div className="applications">
				{getApplications().map((app: FixableAny, index: number) => (
					<AppIcon key={index} data={app} onClick={() => onAppClicked(app, false)} />
				))}
			</div>
			<div className="shortcuts">
				<div className="container">
					{getHomeAppShortcuts().map((shortcut, index) => (
						<Shortcut
							key={index}
							onClick={() => onAppClicked(shortcut, true)}
							data={shortcut}
						/>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export const getHomeAppShortcuts = () => [
	{
		route: 'phone',
		icon: 'call.png',
		payload: {
			subRoute: 'dialNumber'
		}
	},
	{
		route: 'messages',
		icon: 'messages.png'
	},
	{
		route: 'phone',
		icon: 'contacts.png',
		payload: {
			subRoute: 'listContacts'
		}
	},
	{
		route: 'camera',
		icon: 'camera.png'
	}
];

export default ExportingComponent;
