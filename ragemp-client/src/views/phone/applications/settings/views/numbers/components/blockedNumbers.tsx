import { SimulatedResponse } from '../utils/responses';
import { formatPhoneNumber } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_SETTINGS_NUMBERS', window.language);

	const [data, setData] = useState<ExpectedAny[]>([]);

	const unBlockNumber = async (phoneNumber: string) => {
		try {
			const response = await window.rpc.callServer(
				'phone:contacts.unblockNumber',
				JSON.stringify({ phoneNumber })
			);

			if (response === false) throw new Error(`SERVER_ERROR`);

			reloadData();
		} catch (err: ExpectedAny) {
			window.phone.showAlert({
				title: lang.get('Problem'),
				description: lang.get('BlockedNumbers.onUnblock.error'),
				buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
			});
		}
	};

	const reloadData = () => {
		setData([]);
		window.rpc.triggerServer('phone:getBlockedNumbers');
	};

	const onAdd = () => {
		window.phone.showKeyboard({
			inputData: {
				defaultValue: '',
				type: 'text',
				instructions: lang.get('BlockedNumbers.onAdd.instructions'),
				placeholder: lang.get('BlockedNumbers.onAdd.placeholder')
			},
			onSubmit: async (value, { dismiss }) => {
				try {
					const response = await window.rpc.callServer(
						'phone:contacts.blockNumber',
						JSON.stringify({ phoneNumber: value })
					);

					if (response === 'ALREADY_EXISTS') throw new Error('ALREADY_EXISTS');

					if (response === 'YOUR_NUMBER') throw new Error('YOUR_NUMBER');

					if (response === false) throw new Error(`SERVER_ERROR`);

					dismiss();
					reloadData();
				} catch (err: ExpectedAny) {
					if (err.message === 'YOUR_NUMBER') {
						return window.phone.showAlert({
							title: lang.get('Problem'),
							description: lang.get('BlockedNumbers.Error.YOUR_NUMBER'),
							buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
						});
					}

					if (err.message === 'ALREADY_EXISTS') {
						return window.phone.showAlert({
							title: lang.get('Problem'),
							description: lang.get('BlockedNumbers.Error.ALREADY_EXISTS'),
							buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
						});
					}

					window.phone.showAlert({
						title: lang.get('Problem'),
						description: lang.get('BlockedNumbers.Error.SERVER_ERROR'),
						buttons: [{ text: 'Ok', onSelection: ({ dismiss }) => dismiss() }]
					});
				}
			},
			validationFunc: (value) => {
				if (value.length > 6 || value.length < 6) return lang.get('InvalidNumber');
				return true;
			}
		});
	};

	const onBlockedNumbersReceived = async (arr: Array<ExpectedAny>) => {
		// Set the data without affecting the others..
		setData((currentState) => [...currentState, ...arr]);
	};

	useEffect(() => {
		window.rpc.triggerServer('phone:getBlockedNumbers');

		window.socket.on(`phone:blockedNumbers.receivedData`, onBlockedNumbersReceived);

		if (window.mp.fake) {
			window.socket.simulateOn('phone:blockedNumbers.receivedData', SimulatedResponse);
		}

		return () => {
			window.socket.off(`phone:blockedNumbers.receivedData`);
		};
	}, []);

	return (
		<section className="blocked-numbers">
			<div className="header">
				<div className="label">{lang.get('BlockedNumbers.Header')}</div>

				<i className="fas fa-plus" onClick={onAdd}></i>
			</div>

			{data.length ? (
				<div className="entries">
					{data.map((entry, i) => (
						<div key={i} className="entry">
							<div className="left">
								<div className="icon">
									<i className="fas fa-phone-xmark"></i>
								</div>

								<div className="content">
									<div className="number">{formatPhoneNumber(entry.number)}</div>
									<div className="at">
										{moment(entry.createdAt).format('MMMM Do YYYY, h:mm')}
									</div>
								</div>
							</div>

							<div className="right">
								<div
									onClick={() => unBlockNumber(entry.number)}
									className="unblock"
								>
									<i className="fas fa-circle-minus"></i>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="no-entries">
					<i className="icon fas fa-phone-xmark"></i>
					<div className="heading">{lang.get('BlockedNumbers.no-entries')}</div>
				</div>
			)}
		</section>
	);
};
export default Component;
