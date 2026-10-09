import { AudioService } from '@/services/audio';
import { useEffect } from 'react';
import { PhoneState } from '@phone/index';
import { v4 as uuidv4 } from 'uuid';
import { isObject } from 'lodash';

const ExportingComponent = () => {
	const { setNotifications, setRoute, loadApplications } = PhoneState();

	const { playAudio } = AudioService();

	const deletePhoneNotification = (args: ExpectedAny) => {
		const { id } = isObject(args) ? args : JSON.parse(args);

		setNotifications((currentState: ExpectedAny) => {
			let newArray = [...currentState];
			newArray = newArray.filter((noti) => noti.id !== id);
			return newArray;
		});
	};

	const clearPhoneNotifications = () => setNotifications([]);

	const createPhoneNotification = (args: ExpectedAny) => {
		const notification = isObject(args) ? args : JSON.parse(args);

		setNotifications((currentState: ExpectedAny) => {
			const currArray = [...currentState];
			const id = uuidv4();
			const obj: FixableAny = {
				id,
				source: notification.source,
				title: notification.title,
				message: notification.message,
				date: new Date()
			};
			if (notification.onClickOpenAppId) {
				obj.onClick = async () => {
					deletePhoneNotification({ id });
					await loadApplications();
					setRoute(notification.onClickOpenAppId, {});
				};
			}
			currArray.push(obj);

			playAudio(`${__ASSETS__}/audios/phone/notifications/default.mp3`, {
				identifier: `phoneNotification`,
				volume: 0.03
			});

			return currArray;
		});
	};

	useEffect(() => {
		window.rpc.on('createPhoneNotification', createPhoneNotification);
		window.rpc.on('deletePhoneNotification', deletePhoneNotification);
		window.phone.notification = createPhoneNotification;
		window.phone.deleteNotification = deletePhoneNotification;
		window.phone.clearPhoneNotifications = clearPhoneNotifications;

		return () => {
			window.rpc.off('createPhoneNotification', createPhoneNotification);
			window.rpc.off('deletePhoneNotification', deletePhoneNotification);
		};
		// eslint-disable-next-line
	}, []);

	return null;
};

export default ExportingComponent;

interface NotificationArgs {
	source: string;
	title: string;
	message: string;
	onClickOpenAppId?: string;
}
declare global {
	interface Phone {
		notification: (args: NotificationArgs) => void;
		deleteNotification: (args: { id: string }) => void;
		clearPhoneNotifications: () => void;
	}
}
