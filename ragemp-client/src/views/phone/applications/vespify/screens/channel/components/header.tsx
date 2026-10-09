import React from 'react';

// Dependencies
import { copyStringToClipboard } from '@/utils/helpers';

//  Context
import { ScreenState } from '..';

const Component = () => {
	const { data, lang } = ScreenState();

	const copyVideoLink = () => {
		window.toast({
			type: 'info',
			message: lang.get('buttonReactionText')
		});
		copyStringToClipboard(`https://www.youtube.com/${data.information.channelHandle}`);
	};

	return (
		<React.Fragment>
			<div className="component-header">
				{data.information.banner && (
					<div
						className="banner"
						style={{
							backgroundImage: `url("${data.information.banner}")`
						}}
					></div>
				)}
				<div className={`author-details ${!data.information.banner && 'no-banner'}`}>
					<div
						className="avatar"
						style={{
							backgroundImage: `url("${data.information.author.avatar}")`
						}}
					></div>
					<div className="heading">
						<div className="name">{data.information.author.name}</div>
						{data.information.isVerified && (
							<React.Fragment>
								<i className="fa-solid fa-badge-check"></i>
							</React.Fragment>
						)}
					</div>
					<div className="inline-details">
						<div className="handle">{data.information.channelHandle}</div>
						<div className="spacing">
							<i className="icon fa-solid fa-circle"></i>
						</div>
						<div className="subscribers">{data.information.subscribers}</div>
						<div className="spacing">
							<i className="icon fa-solid fa-circle"></i>
						</div>
						<div className="videos">{data.information.videos}</div>
					</div>
					<div className="description">{data.information.description}</div>
				</div>
				<div className="buttons">
					<div className="entry" onClick={copyVideoLink}>
						{lang.get('buttonCopyURL')}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
