import React from 'react';
import moment from 'moment';

//  Context
import { PhoneState } from '@phone/index';

// Depdenencies
import { sortPopupNotifications } from '@phone/utils/helpers';

const ExportingComponent = () => {
	const { notifications, raised } = PhoneState();

	if (raised === true) return null;

	return (
		<React.Fragment>
			<div className="notifications-popup">
				{sortPopupNotifications(notifications).map((entry: FixableAny, index: number) => (
					<div
						key={index}
						className="notification-entry entry on-top"
						onClick={() =>
							entry.onClick
								? entry.onClick()
								: window.phone.deleteNotification({ id: entry.id })
						}
					>
						<div className="header">
							<div className="source">{entry.source}</div>
							<div className="time">
								{moment(new Date(entry.date)).format('HH:mm')}
							</div>
						</div>
						<div className="title">{entry.title}</div>
						<div className="message">{entry.message}</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default ExportingComponent;
