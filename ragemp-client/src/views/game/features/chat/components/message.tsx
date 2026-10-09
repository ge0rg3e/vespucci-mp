import React, { useEffect, useState } from 'react';
import moment from 'moment';

// Dependencies
import { conditionalClassNames, logError } from '@/utils/helpers';
import { formatContentMessage } from '../utils/helpers';

// Context
import { ChatContext } from '..';
import { HudState } from '@/views/game';
import { Button } from '@mui/material';

//  Language
import * as i18n from '@vmp/i18n';
import Language from './message.lang';
const LANGUAGE_KEY = 'game.hud.chatbox.message';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = (props: Props) => {
	const { inputVisible, markMessageAsRead } = ChatContext();
	const { isDarkEnvironment } = HudState();

	// Language
	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	// Chat message..
	let content = formatContentMessage(props.data.content.data, { includeBreakline: true });

	useEffect(() => {
		if (props.data.read === false) {
			markMessageAsRead(props.data.uuid);
		}
	}, [props.data.uuid]); // it's important to have it like this.

	const onReactionClicked = async (entry: ChatReaction) => {
		try {
			// Emit to server
			window.rpc.triggerServer(
				`onChatReaction@${entry.id}`,
				JSON.stringify({
					reactionId: entry.id,
					messageId: props.data.uuid,
					payload: entry.payload
				})
			);
		} catch (err) {
			await logError(`chat.onReactionClicked`, err, { entry });
		}
	};

	return (
		<div
			className={conditionalClassNames(`message  ${props.data.type.text} `, [
				{
					class: `input-visible`,
					if: inputVisible
				},
				{
					class: `dark-mode`,
					if: isDarkEnvironment
				}
			])}
		>
			<div className="--container">
				<div className="content" dangerouslySetInnerHTML={{ __html: content }} />
				<div className="information">
					<div className="sender">{props.data.sender}</div>
					<div className="badge" style={{ color: `${props.data.type.color}` }}>
						<div className="icon">
							<i className={`elm ${props.data.type.icon}`}></i>
						</div>
						<div className="label">{props.data.type.text}</div>
					</div>
					{inputVisible && (
						<div className="date">{moment(props.data.date).format('HH:mm')}</div>
					)}
				</div>
				{props.data.content.reactions && props.data.content.reactions.length > 0 && (
					<div className={`reactions ${inputVisible && 'input-visible'}`}>
						<div className="informational">
							<div className="icon">
								<i className="elm fa-sharp fa-solid fa-comment-smile"></i>
							</div>
							<div className="text">{lang.get('reactions:placeholder')}</div>
						</div>
						<div className="entries">
							{props.data.content.reactions.map((c, index) => (
								<React.Fragment key={index}>
									<Button
										variant="outlined"
										className="entry"
										disabled={c.disabled ? true : false}
										color="primary"
										size="small"
										onClick={() => onReactionClicked(c)}
									>
										{c.label}
									</Button>
								</React.Fragment>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

type Props = {
	data: ChatMessage;
};

export default Component;
