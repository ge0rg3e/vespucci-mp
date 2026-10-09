import React from 'react';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './language';
const LanguageSystemId = 'business:shop:selectionGuidance';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const lang = getLanguagePack(LanguageSystemId, window.language);

	return (
		<React.Fragment>
			<div className="selection-guidance">
				<div className="header">
					<div className="icon">
						<i className="elm fa-regular fa-circle-info"></i>
					</div>
					<div className="label">{lang.get('CartEmpty')}</div>
				</div>
				<div className="controls">
					<div className="heading">{lang.get('Instructions')}</div>

					<div className="entries">
						<div className="entry">
							<div className="icon">
								<span className="mouse-icon left"></span>
							</div>
							<div className="text">{lang.get('Button:Add')}</div>
						</div>

						<div className="entry">
							<div className="icon">
								<span className="mouse-icon right"></span>
							</div>
							<div className="text">{lang.get('Button:Remove')}</div>
						</div>

						<div className="entry">
							<div className="icon">
								<div className="key">Shift</div>
							</div>

							<div className="text">{lang.get('Button:Stack')}</div>
						</div>

						<div className="entry">
							<div className="icon">
								<div className="key">ESC</div>
							</div>
							<div className="text">{lang.get('Button:Escape')}</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
