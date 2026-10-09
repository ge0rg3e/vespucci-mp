import React from 'react';

// Components
import Message from './message';

// Context
import { ChatContext } from '..';
import { conditionalClassNames } from '@/utils/helpers';

const Component = () => {
	const { messages, channel, inputVisible } = ChatContext();

	const getMessages = () => {
		// The original arr
		let arr: Array<ChatMessage> = messages;

		// Get only the channel messages
		if (channel !== 'all') {
			arr = arr.filter((c) => c.channel === channel);
		}

		return arr;
	};

	const classNamesClasses = [
		{
			class: `input-visible`,
			if: inputVisible
		}
	];

	return (
		<React.Fragment>
			<div
				className={conditionalClassNames(`container`, classNamesClasses)}
				id="chatbox-container"
			>
				{getMessages().map((c: ChatMessage, index: number) => (
					<Message key={index} data={c} />
				))}
			</div>
		</React.Fragment>
	);
};

export default Component;
