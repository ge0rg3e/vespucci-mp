import React, { createContext, useContext, useState, useEffect } from 'react';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `PHONE_APP_PHONE`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Context
import { PhoneState } from '../..';

// Phone Context
const Context = createContext({});
export const AppState: ExpectedAny = () => useContext(Context);

// Dependencies
import SimulatedResponse, { SimulatedResponseShareNumber } from './utils/response';
import mappedScreens from './utils/maps';

// Variables
let timerLoading: ExpectedAny = null;

// UI Components
import ScreenLoading from '@phone/components/ui/loadingScreen';
import NavigationFooter from '@phone/components/ui/navigationFooter';
import { getNavigationFooterItems } from './utils/helpers';
import { isPhoneDevelopment } from '../../utils/helpers';

const Component = () => {
	// Get lang
	const lang = i18n.getLanguagePack('PHONE_APP_PHONE', window.language);

	// Contacts
	const [defaultCreateContactData, setDefaultCreateContactData] = useState<ExpectedAny>(null);
	const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
	const [blockedNumbers, setBlockedNumbers] = useState<Array<ExpectedAny>>([]);
	const [recentCalls, setRecentCalls] = useState<Array<RecentCall>>([]);
	const [contacts, setContacts] = useState<Array<PhoneContact>>([]);
	const [searchingContact, setSearchingContact] = useState('');
	const [data, setData] = useState({
		localInfo: {
			// @Reminder: Put this things in response.ts not here.
			number: '000000'
		}
	});

	// Data..
	const [loadingFinished, setLoadingFinished] = useState(false);

	// Sub route of this application
	const { route } = PhoneState();
	const [subRoute, setSubRoute] = useState(route.payload.subRoute || 'dialNumber');

	const onContactsReceived = async (arr: Array<PhoneContact>) => {
		// Set the data without affecting the others..
		setContacts((currentState) => [...currentState, ...arr]);

		// If the timer is still active we clear the timeout.
		if (timerLoading !== null) {
			// Clear timeout
			clearTimeout(timerLoading);

			// Reset timer id
			timerLoading = null;
		}

		// Set the timer..
		timerLoading = setTimeout(() => {
			// Callback function
			setLoadingFinished(true);

			// Reset variable..
			timerLoading = null;
		}, 100);
	};

	const onBlockedNumbersReceived = async (arr: Array<ExpectedAny>) => {
		// Set the data without affecting the others..
		setBlockedNumbers((currentState) => [...currentState, ...arr]);
	};

	const onRecentCallsReceived = async (arr: Array<RecentCall>) => {
		// Set the data without affecting the others..
		setRecentCalls((currentState) => [...currentState, ...arr]);
	};

	const onDataReceived = async (args: string) => {
		const { localInfo } = JSON.parse(args);

		setData({
			localInfo
		});
	};

	const updateBlockedNumbers = (action: 'add' | 'remove', number: string) => {
		setBlockedNumbers((prevBlockedNumbers) =>
			action === 'add'
				? [...prevBlockedNumbers, { number }]
				: prevBlockedNumbers.filter((x) => x.number !== number)
		);
	};

	/**
	 * This will refresh the entire phone contact list and ask the server to send all the contacts again.
	 */

	const refreshContactsList = () => {
		// Set the route here to be safe..
		setSubRoute('listContacts');

		// Set the list to zero
		setContacts([]);

		// Set this to null
		setSelectedContactId(null);

		// Ask the server to send over the contacts.
		window.rpc.triggerServer(`phone:contacts.requestData`);
	};

	/**
	 *
	 * @param id ID Of contact to delete
	 */

	const deleteContactId = (id: number) => {
		// Find the index
		const index = contacts.findIndex((c) => c.id === id);
		if (index == -1) return false;

		// Make the new array
		const newContacts = [...contacts];

		// Delete it
		newContacts.splice(index, 1);

		// If is current id?
		if (selectedContactId === id) {
			setSubRoute('listContacts');
			setSelectedContactId(null);
		}

		setContacts(newContacts);
	};

	/**
	 *
	 * @param id Id of contact to update
	 * @param payload The fields you wanna update
	 */

	const updateContact = (id: number, payload: ExpectedAny) => {
		setContacts((currentState: ExpectedAny) => {
			const index = currentState.findIndex((c: ExpectedAny) => c.id === id);
			if (index === -1) return currentState;

			currentState[index] = {
				...currentState[index],
				...payload
			};

			return currentState;
		});
	};

	/**
	 * Sets the sub-route to 'createContact' and sets the default create contact data.
	 * @param args - The arguments containing the contact details.
	 *
	 */
	const onAddContactWithFilledDetails = (args: ExpectedAny) => {
		// Set the sub-route to 'createContact'
		setSubRoute('createContact');

		// Set phoneNumber and contactName as data
		setDefaultCreateContactData({ ...args });
	};

	/**
	 * This function is used to share a phone number with other players.
	 * @param contactName The name associated with the phone number.
	 * @param phoneNumber The phone number to be shared.
	 */
	const shareNumber = async (contactName: string, phoneNumber: string): Promise<void> => {
		// Get the necessary data
		const targets: ExpectedAny[] = isPhoneDevelopment()
			? SimulatedResponseShareNumber
			: await window.rpc.callServer('phone:shareNumbers.getPlayersNearby');

		// If there is no target nearby
		if (targets.length < 1) {
			return window.phone.showAlert({
				title: 'Share Number',
				description: lang.get('shareNumber.NO_TARGETS'),
				buttons: [
					{
						text: 'Ok',
						onSelection: ({ dismiss }: FixableAny): void => dismiss()
					}
				]
			});
		}

		// Create a list of players
		window.phone.showActionSheetDropdown({
			title: 'Share Number',
			description: lang.get('shareNumber.SheetDropdown'),
			options: targets.map((target) => ({
				text: `${target.name} (${target.id})`,
				onSelection: async ({ dismiss }: FixableAny): Promise<void> => {
					// Send a request to the server to share the number
					const res: string = await window.rpc.callServer(
						'phone:shareNumbers.sendShare',
						JSON.stringify({
							targetId: target.id,
							phoneNumber,
							contactName
						})
					);

					// If the player is invalid, show an alert
					if (res === 'TARGET_UNAVAILABLE') {
						window.phone.showAlert({
							title: 'Share Number',
							description: lang.get('shareNumber.TARGET_UNAVAILABLE'),
							buttons: [
								{
									text: 'Ok',
									onSelection: ({ dismiss }: FixableAny): void => dismiss()
								}
							]
						});
					}

					// If the player doesn't have the app open, show an alert
					if (res === 'APP_CLOSED') {
						window.phone.showAlert({
							title: 'Share Number',
							description: lang.get('shareNumber.APP_CLOSED'),
							buttons: [
								{
									text: 'Ok',
									onSelection: ({ dismiss }: FixableAny): void => dismiss()
								}
							]
						});
					}

					// Close the menu
					dismiss();
				}
			})),
			cancel: {
				text: 'Cancel',
				onCancel: ({ dismiss }: FixableAny): void => dismiss()
			}
		});
	};

	/**
	 * This function is triggered when a share number request is received.
	 * @param args The arguments passed to the function, which includes contactName, phoneNumber, and sender information.
	 */
	const onRequestShareNumber = (args: string): void => {
		const { contactName, phoneNumber, sender } = JSON.parse(args);

		// Show an alert to the user
		window.phone.showAlert({
			title: 'Share Number',
			description: lang.get('shareNumber.Request', { contactName, sender }),
			buttons: [
				{
					text: lang.get('accept'),
					onSelection: async ({ dismiss }): Promise<void> => {
						// Send the data to createContact
						onAddContactWithFilledDetails({ name: contactName, number: phoneNumber });

						// Close the menu
						dismiss();
					}
				},
				{
					color: 'red',
					text: lang.get('reject'),
					onSelection: ({ dismiss }): void => dismiss()
				}
			]
		});
	};

	/**
	 * Deletes the contact log
	 * @param uuid Th
	 * @returns
	 */

	const deleteContactLog = (uuid: string) => {
		// Find the index
		const index = recentCalls.findIndex((c) => c.uuid === uuid);
		if (index == -1) return false;

		// Make the new array
		const newLogs = [...recentCalls];

		// Delete it
		newLogs.splice(index, 1);

		setRecentCalls(newLogs);

		window.rpc.triggerServer(`phone:recentCalls.deleteLog`, JSON.stringify({ uuid }));
	};

	/**
	 *
	 * Deletes all the contat logs.
	 */

	const deleteContactLogs = () => {
		setRecentCalls([]);

		window.rpc.triggerServer(`phone:recentCalls.deleteAllLogs`);
	};

	const gotoContact = (args: ExpectedAny) => {
		const { id } = typeof args === 'string' ? JSON.parse(args) : args;

		// Set the id selected..
		setSelectedContactId(id);

		// Change the route
		setSubRoute('contactDetails');

		// Resetting this
		setSearchingContact('');
	};

	/**
	 * Call a phone number
	 * @param phoneNumber {string} Number
	 * @returns
	 */
	const callNumber = (phoneNumber: string) => {
		// Find recent calls for the specified phone number
		const recentCallsForNumber = recentCalls.filter((call: RecentCall) => call.phoneNumber === phoneNumber);

		// Check if there are recent calls and if the last call was within 30 seconds
		if (recentCallsForNumber.length > 0) {
			const lastCall = recentCallsForNumber[recentCallsForNumber.length - 1];
			const currentTime = Date.now();
			const timeSinceLastCall = currentTime - new Date(lastCall.date).getTime();

			if (timeSinceLastCall < 30000) {
				window.phone.showAlert({
					title: lang.get('Call.AntiSpam.title'),
					description: lang.get('Call.AntiSpam.description'),
					buttons: [
						{
							onSelection: ({ dismiss }) => dismiss(),
							text: 'OK'
						}
					]
				});
				return;
			}
		}

		window.rpc.triggerServer(`phone:call`, JSON.stringify({ phoneNumber }));
	};

	useEffect(() => {
		// Check if the payload contains a 'gotoContact' property
		if (route.payload.gotoContact) {
			gotoContact(route.payload.gotoContact);
		}

		// Check if the payload contains an 'addContactWithFilledDetails' property
		if (route.payload.addContactWithFilledDetails) {
			onAddContactWithFilledDetails(route.payload.addContactWithFilledDetails);
		}

		window.phone.callNumber = callNumber;

		// Set up the events
		window.socket.on(`phoneContacts.receivedData`, onContactsReceived);
		window.socket.on(`phoneRecentCalls.receivedData`, onRecentCallsReceived);

		// RPCS
		window.rpc.on('phoneContacts.shareNumbers.request', onRequestShareNumber);
		window.socket.on(`phone:blockedNumbers.receivedData`, onBlockedNumbersReceived);
		window.rpc.on(`phoneApp.receivedData`, onDataReceived);

		// Ask the server to send over the datas.
		window.rpc.triggerServer(`phone:recentCalls.requestData`);
		window.rpc.triggerServer(`phone:contacts.requestData`);
		window.rpc.triggerServer('phone:getBlockedNumbers');
		window.rpc.triggerServer(`phoneApp.requestData`);

		// If we're developing..
		if (window.mp.fake) {
			// Simulate the event
			window.socket.simulateOn('phoneContacts.receivedData', SimulatedResponse.contacts);
			window.socket.simulateOn('phoneRecentCalls.receivedData', SimulatedResponse.recentCalls);

			// Set data too..
			setData(SimulatedResponse.data);
		}

		return () => {
			// Remove the events
			window.socket.off(`phoneContacts.receivedData`);
			window.socket.off(`phoneRecentCalls.receivedData`);

			// Remove events
			window.rpc.off('phone:shareNumbers.request', onRequestShareNumber);
			window.rpc.off(`phoneApp.receivedData`, onDataReceived);
		};
	}, []);

	const onNavigationSelected = (entry: ExpectedAny) => {
		setSubRoute(entry.payload.subRoute);
	};

	const isNavFooterItemSelected = (entry: ExpectedAny) => {
		// Is subroute is present..
		if (entry.payload.subRoute === subRoute) return true;

		// If is on the following ones

		if (entry.payload.subRoute === 'listContacts') {
			if (['contactDetails', 'createContact', 'editContact', 'contactCard'].includes(subRoute)) return true;
		}

		return false;
	};

	// Props passed
	const ContextProps = {
		// Functions
		refreshContactsList,
		deleteContactId,
		updateContact,
		shareNumber,
		callNumber,
		gotoContact,
		// Sub-routes
		subRoute,
		setSubRoute,
		// Data
		data,
		// Contacts
		contacts,
		setContacts,
		// Recent calls
		recentCalls,
		deleteContactLog,
		deleteContactLogs,
		// Search
		searchingContact,
		setSearchingContact,
		// Contact Selected
		selectedContactId,
		setSelectedContactId,
		contactSelected: selectedContactId ? contacts.find((c) => c.id === selectedContactId) : null,
		defaultCreateContactData,
		blockedNumbers,
		updateBlockedNumbers,
		setDefaultCreateContactData
	};

	// Get rendered component
	const RenderedComponent = mappedScreens[subRoute];

	return (
		<React.Fragment>
			<Context.Provider value={ContextProps}>
				<ScreenLoading loading={!loadingFinished} delayLoadingIcon={500}>
					<div className={`component-view ${subRoute}`}>
						<RenderedComponent />
					</div>
					<NavigationFooter
						theme="dark"
						items={getNavigationFooterItems()}
						onItemSelected={onNavigationSelected}
						isSelected={isNavFooterItemSelected}
					/>
				</ScreenLoading>
			</Context.Provider>
		</React.Fragment>
	);
};

export default Component;
