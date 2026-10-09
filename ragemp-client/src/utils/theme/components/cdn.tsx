import React from 'react';
import { Helmet } from 'react-helmet';

const Component = () => (
	<React.Fragment>
		<Helmet>
			{/* Globally required */}
			<link rel="stylesheet" href={`/assets/css/animate.min.css`} />
			<link rel="stylesheet" href={`/assets/css/fontAwesome.css`} />
			<link rel="stylesheet" href={`/assets/css/fonts.css`} />
			{/* Google fonts */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'true'} />
			<link
				href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap"
				rel="stylesheet"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"
				rel="stylesheet"
			/>

			{/* Required only for character creator */}
			<link rel="stylesheet" href={`/assets/css/rc-slider.css`} />
		</Helmet>
	</React.Fragment>
);

export default Component;
