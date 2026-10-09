import React from 'react';

// Components
import { Button } from '@mui/material';

// Context
import { PageState } from '..';

// Create the language pack..
import ComponentLanguages from './twoFactorAuth.language';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('settings.twoFactorAuth', ComponentLanguages);

const Component = () => {
	const { submitted, submitChanges } = PageState();

	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="card">
				<div className="content">
					<div className="heading">Two-Factor Authentication</div>
					<div className="description mb">{lang.get('description')}</div>

					<div className="form-group">
						<div className="form-label">{lang.get('question:1')}</div>
						<div className="form-component">{lang.get('answer:1')}</div>
					</div>

					<div className="form-group">
						<div className="form-label">{lang.get('question:2')}</div>
						<div className="form-component">{lang.get('answer:2')}</div>
					</div>

					<Button variant="contained" color="primary" className="submit-btn" disabled={submitted || true} onClick={() => submitChanges('password')}>
						{lang.get('button')}
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
