import React from 'react';
import { ViewState } from '..';

const Component = () => {
	const { recipients, lang } = ViewState();

	return (
		<React.Fragment>
			<div className="component-instructions">
				{recipients.length < 1 ? (
					<React.Fragment>
						<div className="icon-container">
							<i className="elm fa-regular fa-circle-info"></i>
						</div>
						<div className="heading">{lang.get('instructions:headingRecipients')}</div>
						<div className="message">{lang.get('instructions:contentRecipients')}</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="icon-container">
							<i className="elm fa-regular fa-pen"></i>{' '}
						</div>
						<div className="heading">{lang.get('instructions:headingMessage')}</div>
						<div className="message">{lang.get('instructions:contentMessage')}</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
