import React from 'react';

// Dependencies
import Container from '@/views/layout/core/container';
import { useRouter } from 'next/router';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';

// Components
import { Button } from '@mui/material';

// Create the language pack..
import ComponentLanguages from './language';
const TranslationPack = createComponentLanguage('notFound', ComponentLanguages);

const Component = () => {
	const router = useRouter();
	const lang = getComponentLanguage(TranslationPack);

	const redirectHome = () => {
		router.replace('/');
	};

	return (
		<Container title="404 - Page Not Found" classNames="page-404" withoutLayout={true}>
			<div className="content">
				<div className="image"></div>
				<h1>
					{lang.get('headingStart')} <span className="primary">Link</span> {lang.get('headingEnd')}
				</h1>
				<div className="description">{lang.get('paragraph')}</div>

				<div className="buttons">
					<Button variant="outlined" color="primary" onClick={redirectHome}>
						{lang.get('button')}
					</Button>
				</div>
			</div>
		</Container>
	);
};

export default Component;
