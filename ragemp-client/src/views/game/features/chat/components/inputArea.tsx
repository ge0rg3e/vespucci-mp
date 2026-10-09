import { conditionalClassNames } from '@/utils/helpers';
import { TextField } from '@mui/material';
import React from 'react';

// Context
import { ChatContext } from '..';

//  Language
import * as i18n from '@vmp/i18n';
import Language from './inputArea.lang';
const LANGUAGE_KEY = 'game.hud.chatbox.inputArea';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = () => {
	const { inputVisible, inputText, setInputText } = ChatContext();
	const { submitMessage } = ChatContext();

	// Language
	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	const onInputChange = (ev: ExpectedAny) => {
		// Input is not visible let's not capture any input.
		if (inputVisible === false) return false;

		// Hit the limit..
		if (ev.target.value.length > 200) return false;

		setInputText(ev.target.value);
	};

	return (
		<React.Fragment>
			<div
				className={conditionalClassNames(`input-area`, [
					{
						class: `visible`,
						if: inputVisible
					}
				])}
			>
				<input
					id="chatbox-input"
					value={inputText}
					onChange={onInputChange}
					className={`input-text`}
					placeholder={lang.get(`input:placeholder`)}
					onKeyDown={(e) => {
						if (e.which === 13) return submitMessage();
					}}
				/>
				<div className="send-btn" onClick={submitMessage}>
					<i className="elm fa-solid fa-paper-plane"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
