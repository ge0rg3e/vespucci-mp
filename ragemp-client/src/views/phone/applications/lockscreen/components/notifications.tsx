import React from 'react';
import { PhoneState } from '@phone/index';
import moment from 'moment';

const ExportingComponent = (props: ExpectedAny) => {
	const { notifications } = PhoneState();

	return (
		<React.Fragment>
			{notifications.length > 1 && (
				<div className="component-header">
					<div className="label">{props.lang.get('Notifications')}</div>
					<button onClick={() => window.phone.clearPhoneNotifications()} className="clear">
						<i className="far fa-xmark"></i>
					</button>
				</div>
			)}
			<div id="lockscreen-notifications" className="notifications">
				<div className="--container">
					{notifications
						.sort((a: FixableAny, b: FixableAny) => b.date - a.date)
						.map((entry: FixableAny, index: number) => (
							<div
								key={index}
								className="notification-entry entry"
								onClick={() => (entry.onClick ? entry.onClick() : window.phone.deleteNotification({ id: entry.id }))}
							>
								<div className="header">
									<div className="source">{entry.source}</div>
									<div className="time">{moment(new Date(entry.date)).format('HH:mm')}</div>
								</div>
								<div className="title">{entry.title}</div>
								<div className="message">{entry.message}</div>
							</div>
						))}
				</div>
			</div>
		</React.Fragment>
	);
};
export default ExportingComponent;
