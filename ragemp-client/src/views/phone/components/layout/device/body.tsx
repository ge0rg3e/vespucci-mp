import React, { useEffect } from 'react';

import Buttons from './buttons';
import StatusBar from './statusbar';
import NotificationPopup from '@/views/phone/components/layout/notifications';

// Layout Components
import Alert from '@phone/components/layout/alert';
import ActionSheet from '@phone/components/layout/actionSheet';
import Keyboard from '@phone/components/layout/keyboard';
import ActionSheetDropdown from '@phone/components/layout/actionSheetDropdown';
import PhoneCall from '@phone/components/layout/phoneCall';
import CrashBoundary from '@/views/phone/components/layout/crash';

// Dependencies
import { PhoneState } from '@phone/index';
import { HudState } from '@/views/game';
import { conditionalClassNames } from '@/utils/helpers';
import { isNativePhoneRoute, isNativeRouteClosable, sortPopupNotifications } from '../../../utils/helpers';

const ExportingComponent = (props: ExpectedAny) => {
	const { visible, raised, route, notifications, closeApplication, uiState } = PhoneState();
	const { isDarkEnvironment } = HudState();

	const manuallyRaise = () => {
		window.rpc.triggerClient(`setPhoneIsRaised`, JSON.stringify({ boolean: !raised }));
		if (window.mp.fake) {
			window.raisePhone({ boolean: !raised });
		}
	};

	const clickedNotifications = () => {
		window.takeToLockScreen();
		if (raised === false) {
			window.raisePhoneManually();
		}
	};
	useEffect(() => {
		window.raisePhoneManually = manuallyRaise;
		return () => {
			window.raisePhoneManually = undefined;
		};
	}, []);

	const onClosingLinePressed = () => {
		// Is phone call overlay fullscreen visible?
		const phoneCallOverlay = document.getElementsByClassName('phoneCall-overlay fullScreen')[0];
		if (phoneCallOverlay) return false;

		// Close..
		closeApplication(true);
	};

	// If phone is not visible at all we don't render anything.
	if (visible === null) return null;

	return (
		<React.Fragment>
			<div
				id="phone-mockup"
				className={conditionalClassNames(`phone-mockup`, [
					{
						class: 'raised',
						if: raised === true
					},
					{ class: 'night-mode', if: isDarkEnvironment === true }
				])}
			>
				<NotificationPopup />
				<div className="device-frame-border">
					<div className="device-frame">
						<div className="device-screen-border">
							<div className="device-screen">
								<div
									className={conditionalClassNames(
										`device-content phone-app-route-${route.id} theme-${window.phone.theme}`,
										[
											{ class: 'app-loading', if: uiState.loading },
											{ class: `app-blurred`, if: uiState.blurred },
											{ class: `app-opening`, if: uiState.opening }
										]
									)}
								>
									<CrashBoundary>
										<StatusBar />

										<div className={`screen-content`}>
											{props.children}
											<Keyboard />
										</div>
										{(!isNativePhoneRoute(route.id) || isNativeRouteClosable(route.id)) &&
											!uiState.loading &&
											uiState.closeLineVisible && (
												<div className="closing-area" onClick={() => closeApplication(true)}>
													<div className="closing-line"></div>
												</div>
											)}
									</CrashBoundary>
								</div>
								{/* Components */}
								<ActionSheetDropdown />
								<ActionSheet />
								<Alert />
								<PhoneCall />
							</div>
						</div>
					</div>
				</div>
				<div className="device-header">
					{notifications.length > 0 && route !== 'lockscreen' && (
						<React.Fragment>
							<div className="notifications-alert" onClick={clickedNotifications}>
								<i className="icon fa-solid fa-bell-on"></i>
							</div>
						</React.Fragment>
					)}
					<div className="control-area" onClick={manuallyRaise} />
				</div>
				<Buttons />
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
