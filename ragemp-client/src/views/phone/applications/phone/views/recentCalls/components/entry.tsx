import React from 'react';
import moment from 'moment';

// Context
import { AppState } from '../../..';

// Dependencies
import { formatPhoneNumber } from '@/utils/helpers';
import { ViewState } from '..';
import { getLanguagePack } from '@vmp/i18n';

const Component = (props: ExpectedAny) => {
	const { contacts, callNumber, setSelectedContactId, setDefaultCreateContactData, setSubRoute } = AppState();
	const lang = getLanguagePack('PHONE_APP_PHONE_RECENTCALLS', window.language);
	const { editing, deleteEntry } = ViewState();

	const getDisplayName = () => {
		const contact = getContactMatching();

		if (!contact && props.data.phoneNumber.length > 3) return formatPhoneNumber(props.data.phoneNumber);
		if (!contact && props.data.phoneNumber.length === 3) return props.data.phoneNumber;

		return contact.name;
	};

	const getContactMatching = () => {
		const contact = contacts.find((c: ExpectedAny) => c.number === props.data.phoneNumber);
		return contact || null;
	};

	const formatDate = (date: Date) => {
		const today = moment().startOf('day');
		const providedDate = moment(date);

		// If is same day
		if (providedDate.isSame(today, 'day')) {
			// If the date is from today
			return lang.get('todayAt', { time: providedDate.format('HH:mm') });
		}

		// If is same week
		if (providedDate.isoWeek() === today.isoWeek()) {
			// If the date is from this week but not today
			return lang.get('at', {
				day: providedDate.format(`dddd`),
				time: providedDate.format(`HH:mm`)
			});
		}

		// Defaulting..
		return providedDate.format(`DD/MM/YYYY, HH:mm`);
	};

	const onCall = () => callNumber(props.data.phoneNumber);

	const addUnknownNumberToContanct = () => {
		// Set data
		setDefaultCreateContactData({ name: '', number: props.data.phoneNumber });

		// Change the route
		setSubRoute('createContact');
	};

	const onDetails = () => {
		const contact = getContactMatching();
		if (!contact) return addUnknownNumberToContanct();

		// Set the id selected..
		setSelectedContactId(contact.id);

		// Change the route
		setSubRoute('contactDetails');
	};

	return (
		<React.Fragment>
			<div className={`entry ${editing && 'editing'} ${props.data.callMissed && 'missed'}`}>
				{editing && (
					<div className={`deleteBtn`} onClick={() => deleteEntry(props.data.uuid)}>
						<i className="icon fa-solid fa-circle-minus"></i>
					</div>
				)}
				{props.data.isCaller && (
					<div className="isCaller">
						<i className="icon fa-solid fa-phone-arrow-up-right"></i>
					</div>
				)}
				<div className="details" onClick={onCall}>
					<div className="name"> {getDisplayName()}</div>
					<div className="device">phone</div>
				</div>
				<div className="right-side" onClick={onDetails}>
					<div className="date">{formatDate(props.data.date)}</div>
					<div className={`information ${!getContactMatching() && 'disabled'}`}>
						<i className="icon fa-regular fa-circle-info"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
