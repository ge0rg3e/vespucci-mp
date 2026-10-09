import React from 'react';
import { ScreenState } from '../../../..';
import { removeHtmlTags } from '@/views/game/features/chat/utils/helpers';
import { logError } from '@/utils/helpers';

const Component = () => {
	const { data, expandedModalId, setExpandedModalId, lang } = ScreenState();

	const getDescription = () => {
		try {
			let text = data.information.description;

			// Replace any dangerous html just in
			text = removeHtmlTags(text);

			// Replace \n with <br/>
			text = text.replace(/\n/g, '<br/>');

			return text;
		} catch (err) {
			logError(`phone.vespify.modalDescription.getDescription`, err);
			return 'ERR: NO_DESCRIPTION';
		}
	};

	if (expandedModalId !== 'description') return null;

	return (
		<React.Fragment>
			<div className="component-modal-content --description">
				<div className="header">
					<div className="title">{lang.get('descriptionHeading')}</div>
					<div className="close" onClick={() => setExpandedModalId(null)}>
						<i className="icon fa-solid fa-xmark"></i>
					</div>
				</div>
				<div className="content">
					<div
						className="description"
						dangerouslySetInnerHTML={{ __html: getDescription() }}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
