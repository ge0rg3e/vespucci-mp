import React, { useEffect } from 'react';

// Context
import { ChatContext } from '..';
import { conditionalClassNames, useStateRef } from '@/utils/helpers';

//  Language
import * as i18n from '@vmp/i18n';
import Language from './channels.lang';
import { key } from '@/definitions/keys';
import { AppContext } from '@/utils/context';
const LANGUAGE_KEY = 'game.hud.chatbox.channels';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = () => {
	const { getMessages, channel, inputVisible, inputVisibleRef } = ChatContext();
	const { changeChannel, channelRef } = ChatContext();
	const { accountRef } = AppContext();

	// Language
	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	// Get the channels available
	const getChannels = () => {
		let arr = [];

		// Where all messages are available and unfiltered.
		arr.push({
			id: 'all',
			label: lang.get(`channel:all`),
			icon: `fa-solid fa-border-all`
		});

		// Where general server messages and chat are available
		arr.push({
			id: `general`,
			label: lang.get(`channel:general`),
			icon: `fa-solid fa-house`
		});

		// Where general server messages and chat are available
		arr.push({
			id: `system`,
			label: lang.get(`channel:system`),
			icon: `fa-solid fa-server`
		});

		// Staff messages - This tab can be seen only by staff members or at least people who has messages
		let acc = accountRef.current ? accountRef.current : {};
		let isStaffMember = acc.adminLevel > 0 || acc.helperLevel > 0 ? true : false;

		if (isStaffMember || getMessages('staff', false, true).length > 0) {
			arr.push({
				id: `staff`,
				label: lang.get(`channel:staff`),
				icon: `fa-solid fa-suitcase`
			});
		}

		return arr;
	};

	const onKeyPressed = (e: ExpectedAny) => {
		// If is not key tab.
		if (!key(e, 'Tab')) return false;
		if (inputVisibleRef.current === false) return false;

		// Get all channels
		const arr = getChannels();

		// Get the index of current channel
		const indexOf = arr.findIndex((c) => c.id === channelRef.current);
		// Get its index..
		let indexUsed = indexOf !== -1 ? indexOf : 0;

		// Calcualte new index..
		let newIndex = arr[indexUsed + 1] !== undefined ? indexUsed + 1 : 0;

		changeChannel(arr[newIndex].id);
	};

	useEffect(() => {
		document.addEventListener('keydown', onKeyPressed);

		return () => {
			document.removeEventListener('keydown', onKeyPressed);
		};
	}, []);

	return (
		<React.Fragment>
			<div
				className={conditionalClassNames(`channels`, [
					{ class: `visible`, if: inputVisible }
				])}
			>
				{getChannels().map((ch, ix: number) => (
					<div
						className={conditionalClassNames(`entry`, [
							{
								class: `selected`,
								if: channel === ch.id
							},
							{
								class: `unread`,
								if:
									// Is not current channel
									channel !== ch.id &&
									// Unread messages?
									getMessages(ch.id, true).length > 0
							}
						])}
						key={ix}
					>
						<div className="content" onClick={() => changeChannel(ch.id)}>
							<div className="icon">
								<i className={`elm ${ch.icon}`}></i>
							</div>
							<div className="label">{ch.label}</div>
							<div className="unread-badge">
								<i className={`elm fa-solid fa-circle`}></i>
							</div>
						</div>
					</div>
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
