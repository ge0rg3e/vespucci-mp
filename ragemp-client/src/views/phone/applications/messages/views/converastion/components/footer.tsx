import { getLanguagePack } from '@vmp/i18n';
import { useState, Fragment } from 'react';
import EmojiPicker from './emojiPicker';
import { AppState } from '../../..';
import moment from 'moment';

// Material
import { TextField, ButtonBase } from '@mui/material';

const Component = (props: Props) => {
	const lang = getLanguagePack('PHONE_APP_MESSAGES_CONVERSATION', window.language);
	const [emojiPicker, setEmojiPicker] = useState(false);
	const [inputText, setInputText] = useState('');
	const [rows, setRows] = useState(1);

	const { messageSentAt, sendMessageDisabled } = AppState();

	const onFieldChange = (ev: ExpectedAny) => {
		// We don't allow too long messages.
		if (ev.target.value.length > 150) return false;

		// Count rows
		const textareaRows = ev.target.value.split('\n').length;
		setRows(textareaRows);

		// Update text..
		setInputText(ev.target.value);
	};

	const sendText = () => {
		if (inputText.length < 1) return false; // Anti spam on button

		// Send message..
		props.onSendMessage(inputText);

		// Reset input..
		setInputText('');
	};

	const onKeyDown = (ev: ExpectedAny) => {
		if (ev.key === 'Enter' && !ev.shiftKey) {
			ev.preventDefault();
			sendText();
		}
	};

	return (
		<Fragment>
			<div className="component-conversation-footer">
				<div className="emojiPickerToggle" onClick={() => setEmojiPicker((o) => !o)}>
					<img src="/assets/images/phone/apps/messages/emojiPicker/people.png" alt="" />
				</div>

				<div className="input-container">
					<TextField
						placeholder={lang.get('Footer.input.placeholder')}
						onKeyDown={onKeyDown} // Add onKeyDown event handler
						disabled={props.disabled ? true : false || moment().diff(moment(messageSentAt)) < 10000}
						onChange={onFieldChange}
						variant="outlined"
						value={inputText}
						multiline={true}
						fullWidth={true}
						maxRows={5}
					/>
					<ButtonBase
						className={`send-button ${rows > 1 ? 'bottom' : ''}`}
						onClick={sendText}
						disabled={
							inputText.length < 1 || moment().diff(moment(messageSentAt)) < 10000 || props.disabled
						}
					>
						<i className="icon fa-solid fa-arrow-up"></i>
					</ButtonBase>
				</div>
			</div>

			<EmojiPicker onSelectEmoji={(emoji) => setInputText(`${inputText} ${emoji}`)} active={emojiPicker} />
		</Fragment>
	);
};

type Props = {
	onSendMessage: (inputText: string) => void;
	disabled?: boolean;
};

export default Component;
