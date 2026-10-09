import React from 'react';

// Dependencies
import { formatNumberShort, truncateString } from '@/utils/helpers';
import { removeHtmlTags } from '@/views/game/features/chat/utils/helpers';

// Context
import { ScreenState } from '../../../..';

const Component = () => {
	const { data, setExpandedModalId, lang } = ScreenState();

	const getHighlightedComment = () => data.comments.entries[0];

	const formatCommentText = (text: string) => {
		// Replace any dangerous html just in
		text = removeHtmlTags(text);

		// Replace \n with <br/>
		text = text.replace(/\n/g, '<br/>');

		return text;
	};

	const openModal = () => {
		// Set modal id
		setExpandedModalId('comments');
	};

	// If there were no comments data.
	if (data.comments.entries.length < 1) return null;

	return (
		<React.Fragment>
			<div className="component-comment-highlight" onClick={openModal}>
				<div className="header">
					<div className="text">{lang.get('commentsHeading')}</div>
					<div className="count">{formatNumberShort(data.comments.total)}</div>
				</div>
				<div className="entry">
					<div
						className="avatar"
						style={{
							backgroundImage: `url("${getHighlightedComment().author.avatar}")`
						}}
					></div>

					<div
						className="text"
						dangerouslySetInnerHTML={{
							__html: formatCommentText(
								truncateString(getHighlightedComment().text, 120, true)
							)
						}}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
