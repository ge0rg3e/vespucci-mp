import React from 'react';

// Context
import { ScreenState } from '../../../..';
import { removeHtmlTags } from '@/views/game/features/chat/utils/helpers';
import { AppState } from '@/views/phone/applications/vespify';
import moment from 'moment';

const Component = () => {
	const { data, expandedModalId, setExpandedModalId, lang } = ScreenState();
	const { setScreen } = AppState();

	const getComments = () => data.comments.entries;

	const formatCommentText = (text: string) => {
		// Replace any dangerous html just in
		text = removeHtmlTags(text);

		// Replace \n with <br/>
		text = text.replace(/\n/g, '<br/>');

		return text;
	};

	const goToChannel = (id: string) => {
		setScreen({
			id: 'channel',
			payload: { id }
		});
	};

	if (expandedModalId !== 'comments') return null;

	return (
		<React.Fragment>
			<div className="component-modal-content --comments">
				<div className="header">
					<div className="title">{lang.get('commentsHeading')}</div>
					<div className="close" onClick={() => setExpandedModalId(null)}>
						<i className="icon fa-solid fa-xmark"></i>
					</div>
				</div>
				<div className="content">
					<div className="entries">
						{getComments().map((c: ExpectedAny, ix: number) => (
							<div key={ix} className={`entry`}>
								<div
									className="avatar"
									onClick={() => goToChannel(c.author.id)}
									style={{
										backgroundImage: `url("${c.author.avatar}")`
									}}
								></div>
								<div className="comment-content">
									<div className="--header">
										<div className="author">{c.author.name}</div>
										{c.relativeDate !== null && (
											<div className="date">{moment(c.relativeDate).fromNow()}</div>
										)}
									</div>
									<div
										className="--message"
										dangerouslySetInnerHTML={{
											__html: formatCommentText(c.text)
										}}
									/>
									{c.likes > 0 && (
										<div className="--likes">
											<div className="icon">
												<i className="elm fa-light fa-thumbs-up"></i>
											</div>
											<div className="text">{c.likes}</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
