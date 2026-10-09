import React from 'react';
import { copyStringToClipboard, formatNumberShort } from '@/utils/helpers';
import { ScreenState } from '../../../..';

const Component = () => {
	const { data, lang } = ScreenState();

	const copyVideoLink = () => {
		window.toast({
			type: 'info',
			message: lang.get('shareActionText')
		});
		copyStringToClipboard(`https://youtube.com/watch?v=${data.information.id}`);
	};

	return (
		<React.Fragment>
			<div className="component-buttons">
				<div className="entry like no-click">
					<i className="icon fa-regular fa-thumbs-up"></i>
					<div className="text">{formatNumberShort(data.information.likes)}</div>
				</div>
				<div className="entry" onClick={copyVideoLink}>
					<i className="icon fa-regular fa-share"></i>
					<div className="text">{lang.get('shareButtonText')}</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
