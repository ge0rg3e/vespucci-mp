import React from 'react';

// Context
import { ScreenState } from '../../../..';
import { AppState } from '@/views/phone/applications/vespify';
import moment from 'moment';

const Component = () => {
	const { data, setExpandedModalId, lang } = ScreenState();
	const { setScreen } = AppState();

	const openDescriptionModal = () => {
		// Set modal id
		setExpandedModalId('description');
	};

	const goToAuthorChannel = () => {
		setScreen({
			id: 'channel',
			payload: { id: data.information.author.id }
		});
	};

	return (
		<React.Fragment>
			<div className="component-video-details">
				<div className="title">{data.information.title}</div>
				<div className="short-inline-info" onClick={openDescriptionModal}>
					<div className="views">
						{data.information.views} {window.language === 'EN' ? 'views' : 'vizualizări'}
					</div>
					{data.information.relativeDate !== null && (
						<React.Fragment>
							<div className="spacing">
								<i className="icon fa-solid fa-circle"></i>
							</div>
							<div className="age">{moment(data.information.relativeDate).fromNow()}</div>
						</React.Fragment>
					)}
					<div className="more-details">{lang.get('moreDetailsButtonText')}</div>
				</div>
				<div className="channel">
					<div className="author" onClick={goToAuthorChannel}>
						<div
							className="avatar"
							style={{
								backgroundImage: `url("${data.information.author.avatar}")`
							}}
						></div>
						<div className="details">
							<div className="name">{data.information.author.name}</div>
							<div className="subscribers">{data.information.author.subscribers}</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
