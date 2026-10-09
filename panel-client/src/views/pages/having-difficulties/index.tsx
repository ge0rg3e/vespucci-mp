import React from 'react';
import { Button } from '@mui/material';

// Dependencies
import Container from '@/views/layout/core/container';
import { useRouter } from 'next/router';

// Dependencies
import { getComponentLanguage, createComponentLanguage } from '@/utils/helpers';
import ComponentLanguages from './language';

// Create the language pack..
const TranslationPack = createComponentLanguage('havingDifficulties', ComponentLanguages);

const Component = () => {
	const router = useRouter();
	const lang = getComponentLanguage(TranslationPack);

	return (
		<Container title="Technical difficulties" classNames="page-404" withoutLayout={true}>
			<div className="content">
				<img src="/assets/images/pages/having-difficulties/image.png" alt="Image"></img>
				<h1 className="heading">{lang.get('heading')}</h1>
				<div className="description">{lang.get('description')}</div>
				{router.query.code && (
					<div className="code">
						{lang.get('errorCode')}: <span>{router.query.code}</span>
					</div>
				)}

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
