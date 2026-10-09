import { isElementVisible, logError } from '@/utils/helpers';
import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { HudState } from '../../';
let timerHide: UndefinedAny = null;
let timerShow: UndefinedAny = null;
let timerInputChanged: UndefinedAny = null;

//  Language
import * as i18n from '@vmp/i18n';
import Language from './language';
import { formatContentMessage } from '../chat/utils/helpers';
import { AppContext } from '@/utils/context';
const LANGUAGE_KEY = 'HUD_DIALOG';

i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Dialog = () => {
	const [data, setData] = useState<ExpectedAny>(null);
	const [inputValue, setInputValue] = useState('');

	const [selectedItem, setSelectedItem] = useState(0);
	const { refs } = HudState();
	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	// eslint-disable-next-line
	const [secondsLeft, setSecondsLeft] = useState<any>(null);

	const dataRef = useRef<ExpectedAny>({});

	const { setDialogVisible } = AppContext();

	const hideDialogInSeconds = (seconds: number) => {
		timerHide = setInterval(() => {
			setSecondsLeft((currentState: number) => {
				if (currentState > 1) return currentState - 1; // reduce by 1..

				// Hide the dialog and everything..
				onHideDialog();

				// Inform client-side too.
				window.rpc.triggerClient(`dialog@close`);

				// For state..
				return null;
			});
		}, 1000);
		setSecondsLeft(seconds);
	};

	const onDialogShowsCallbacks = (payload: ExpectedAny) => {
		// If is payload input we need the input focused
		if (payload.type == 'input') {
			const onTimeoutFinished = () => {
				const doc = document.getElementById('dialog-input');
				if (doc) {
					doc.focus();
				}
			};

			// Call it in 600 ms..
			setTimeout(onTimeoutFinished, 600);
		}

		// If is a list we need the first one selected
		if (payload.type === 'list') {
			setSelectedItem(0);
		}

		// f they didn't set the seconds left then let's clear it up.
		if (!payload.hideInSeconds) {
			setSecondsLeft(null);
		}

		// Reset a few inputs..
		setInputValue('');
	};

	const onShowDialog = async (args: ExpectedAny) => {
		try {
			const payload = JSON.parse(args);

			// Clear any timers to prevent bugs.
			clearTimers();

			// If they want to make sure the dialog will hide in a few seconds..
			if (payload.hideInSeconds) {
				hideDialogInSeconds(payload.hideInSeconds);
			}

			// A few callbacks needed..
			onDialogShowsCallbacks(payload);

			// They want this to appear right away..
			if (!payload.appearInSeconds) {
				setData(payload);
				return true;
			}

			// They want to start it after a few seconds for better effect..
			timerShow = setTimeout(() => {
				// Set the data
				setData(payload);

				// Reset timer id
				timerShow = null;
			}, payload.appearInSeconds * 1000);
		} catch (err) {
			await logError(`SHOW_DIALOG`, err);
		}
	};

	const clearTimers = () => {
		// Clear the timer that auto hides the dialog
		if (timerHide !== null) {
			// Clear interval
			clearInterval(timerHide);

			// Reset timer id
			timerHide = null;
		}

		// Clear the timer that shows the dialog in a few seconds..
		if (timerShow !== null) {
			// Clear timeout
			clearTimeout(timerShow);

			// Reset timer id
			timerShow = null;
		}
	};

	const onHideDialog = () => {
		// Reset timers
		clearTimers();

		// Reset data..
		setData(null);
	};

	useEffect(() => {
		setDialogVisible(data ? true : false);
	}, [data]);

	const renamedKeys: ExpectedAny = {
		Escape: 'ESC'
	};

	const sendDialogResponse = (args: ExpectedAny) => {
		if (dataRef.current.data === null) return false;

		const currData = dataRef.current.data;

		const listItemSelected = currData.type === 'list' ? dataRef.current.selectedItem : null;
		const listItemOptions = currData.type === 'list' ? currData.listProps.entries : null;
		const inputText = currData.type === 'input' ? dataRef.current.inputValue : null;

		window.rpc.triggerServer(
			`onDialogResponse`,
			JSON.stringify({
				dialogId: currData.dialogId,
				responseKey: args.responseKey || null,
				listItemSelected,
				listItemOptions,
				inputText,
				expired: args.expired || false,
				payload: currData.payload,
				buttons: currData.buttons
			})
		);
	};

	const onKeyPressed = (ev: UndefinedAny) => {
		if (dataRef.current.data === null) return false;
		if (refs.current.gameHudHidden === true) return false;
		if (dataRef.current.data.type === 'input') return false;
		// const doc = document.getElementById('dialog-input');
		// if (doc === document.activeElement) return false;

		let { key } = ev;

		// Checking if the user is typing into an input and making sure that input is from the dialog only.
		// Case examples: Chat is Open and you Type "F" => it would trigger the chat.

		const inputFocused = document.activeElement;

		if (
			inputFocused &&
			['input', 'textarea'].includes(inputFocused.localName) &&
			inputFocused.id !== 'dialog-input'
		)
			return false;

		// Navigation when is a list

		if (dataRef.current.data.type === 'list' && [`ArrowUp`, `ArrowDown`].includes(key)) {
			const direction = key === 'ArrowUp' ? 'up' : 'down';
			const newId = direction === 'up' ? dataRef.current.selectedItem - 1 : dataRef.current.selectedItem + 1;

			const wrapper = document.getElementById('#list-scrollable');

			if (direction === 'up') {
				const existsUp = dataRef.current.data.listProps.entries[newId];
				if (existsUp) {
					setSelectedItem(newId);
					const doc = document.getElementById(`#list-item-${newId}`);
					if (doc && wrapper && !isElementVisible(doc, wrapper)) {
						wrapper!.scrollTop -= doc!.offsetHeight;
					}
				}
			} else {
				const existsDown = dataRef.current.data.listProps.entries[newId];
				if (existsDown) {
					setSelectedItem(newId);
					const doc = document.getElementById(`#list-item-${newId}`);
					if (doc && wrapper && !isElementVisible(doc, wrapper)) {
						wrapper!.scrollTop += doc!.offsetHeight;
					}
				}
			}
			ev.preventDefault();
			return false;
		}

		if (renamedKeys[key]) {
			// Renaming some keys.
			key = renamedKeys[key];
		}
		const matchedButton = dataRef.current.data.buttons.find(
			(button: UndefinedAny) => button.key.toLowerCase() === key.toLowerCase()
		);

		if (!matchedButton) return;

		sendDialogResponse({
			responseKey: matchedButton.key
		});
	};

	const updateData = async (args: string) => {
		const payload = JSON.parse(args);

		// Update partial..
		setData((currentState: ExpectedAny) => ({ ...currentState, ...payload }));
	};

	useEffect(() => {
		// Not yet.
		if (data === null) return;

		if (timerInputChanged !== null) {
			// Clear timeout
			clearTimeout(timerInputChanged);

			// Clear timer id.
			timerInputChanged = null;
		}

		timerInputChanged = setTimeout(() => {
			// Inform client-side
			window.rpc.triggerClient(
				`onDialogInputValueChanged@${data.dialogId}`,
				JSON.stringify({ ...data, inputValue })
			);

			// Reset timer id
			timerInputChanged = null;
		}, 1000);
	}, [inputValue]);

	useEffect(() => {
		dataRef.current = {
			data,
			inputValue,
			selectedItem
		};
	}, [data, inputValue, selectedItem]);

	useEffect(() => {
		window.rpc.on(`onShowDialog`, onShowDialog);
		window.rpc.on(`onHideDialog`, onHideDialog);
		window.rpc.on(`dialog:updateData`, updateData);

		document.addEventListener('keydown', onKeyPressed);

		return () => {
			window.rpc.off(`onShowDialog`, onShowDialog);
			window.rpc.off(`onHideDialog`, onHideDialog);
			window.rpc.off(`dialog:updateData`, updateData);

			document.removeEventListener('keydown', onKeyPressed);

			// Clear timers
			clearTimers();
		};
	}, []);

	const formatMessage = (msg: string) => {
		let newMsg = msg;
		newMsg = newMsg.replaceAll(`<key>`, `<span class="border-shape key">`);
		newMsg = newMsg.replaceAll(`</key>`, `</span>`);
		newMsg = newMsg.replaceAll(`<command>`, `<span class="border-shape command">`);
		newMsg = newMsg.replaceAll(`</command>`, `</span>`);
		newMsg = newMsg.replaceAll(`{BR}`, `<br/>`);
		return newMsg;
	};

	const MessageFormatted = ({ msg }: FixableAny) => (
		<div className="message" dangerouslySetInnerHTML={{ __html: formatMessage(msg) }} />
	);

	const iconMapped: ExpectedAny = {
		question: 'fa-light fa-circle-question',
		warning: `fa-solid fa-triangle-exclamation`,
		information: `fa-solid fa-circle-info`
	};

	const formatList = (src: ExpectedAny) => {
		let newSrc = [...src];

		if (data.listProps.columns === undefined) {
			newSrc = newSrc.map((x: ExpectedAny) => [x]);
		}

		return newSrc;
	};

	if (data === null || refs.current.gameHudHidden === true) return null;

	return (
		<React.Fragment>
			<div className="hud-dialog">
				<div className="component-container">
					<div className="component-content">
						{data.icon && (
							<div className="icon-container">
								<i className={`elm ${data.icon} ${iconMapped[data.icon]}`}></i>
							</div>
						)}
						<div className="title">{data.title}</div>
						<div
							className={`content ${data.icon && data.buttons.length < 1 ? `with-icon-no-buttons` : ``}`}
						>
							{[`message`, `input`].includes(data.type) && data.content && data.content.length > 0 && (
								<MessageFormatted msg={data.content} />
							)}

							{data.type === 'input' && (
								<div className="input-container">
									<TextField
										fullWidth={true}
										variant="outlined"
										multiline={data.inputProps.multiline === true}
										rows={data.inputProps.multiline ? 2 : 1}
										id="dialog-input"
										type={data.inputProps.type || 'text'}
										placeholder="Write in this input..."
										onKeyPress={(e) => {
											if (e.charCode === 13) {
												const btn = data.buttons ? data.buttons[0].key : null;
												sendDialogResponse({ responseKey: btn });
											}
										}}
										value={inputValue}
										onChange={(ev) => setInputValue(ev.target.value)}
									/>
								</div>
							)}

							{data.type === 'list' && (
								<div className="list-container">
									{data.listProps.columns && (
										<div className="row header">
											{data.listProps.columns.map((col: string, ix: number) => (
												<div className="col" key={ix}>
													{col}
												</div>
											))}
										</div>
									)}
									<div id="#list-scrollable" className="scrollable">
										{formatList(data.listProps.entries).map((row: FixableAny, ix: number) => (
											<div
												id={`#list-item-${ix}`}
												className={`row ${selectedItem === ix ? `selected` : `null`}`}
												key={ix}
											>
												{row.map((entry: FixableAny, ixx: number) => (
													<div
														key={ixx}
														className="col"
														dangerouslySetInnerHTML={{
															__html: formatContentMessage(`${entry}`)
														}}
													/>
												))}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
						{data.footer && (
							<div className={`footer ${data.buttons && data.buttons.length > 0 && `no-mb`}`}>
								<MessageFormatted msg={data.footer} />
							</div>
						)}
						{data.type === 'list' && (
							<React.Fragment>
								<div className="arrows-list-hint">
									<div className="icons">
										<i className="icon fa-solid fa-arrow-up"></i>
										<i className="icon fa-solid fa-arrow-down"></i>
									</div>
									<div className="text">{lang.get('UseArrows')}</div>
								</div>
							</React.Fragment>
						)}
						{data.buttons && data.buttons.length > 0 && (
							<React.Fragment>
								<div className="buttons">
									{data.buttons.map((button: FixableAny, ix: number) => (
										<div
											className="entry"
											key={ix}
											onClick={() => sendDialogResponse({ responseKey: button.key })}
										>
											{data.type !== 'input' && <span className="key">{button.key}</span>}
											<span className="text">{button.text}</span>
										</div>
									))}
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Dialog;
