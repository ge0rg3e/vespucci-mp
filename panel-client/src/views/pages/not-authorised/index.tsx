import React from 'react';
import { Button } from '@mui/material';

// Dependencies
import Container from '@/views/layout/core/container';

// Dependencies
import { getComponentLanguage, createComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './language';

// Create the language pack..
const TranslationPack = createComponentLanguage('notAuthorised', ComponentLanguages);

const Component = () => {
	const lang = getComponentLanguage(TranslationPack);

	return (
		<Container title="Not authorised" classNames="page-404" withoutLayout={true}>
			<div className="content">
				<img src="/assets/images/pages/having-difficulties/image.png" alt="Image"></img>
				<h1>{lang.get('heading')}</h1>

				<div className="description">{lang.get('description')}</div>

				<div className="buttons">
					<Button color="primary" variant="outlined">
						Go back to homepage
					</Button>
				</div>
			</div>
		</Container>
	);
};

export default Component;
