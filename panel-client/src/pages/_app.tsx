import React from 'react';

// Dependencies
import Head from 'next/head';

// Components of the application
import Context from '@utils/context';
import Theme from '@utils/theme';

// Injecting the stylesheets...
import '../../public/assets/css/style.css';

// Dependencies
import { getUserDefaultSessionData } from '@/utils/helpers';

// @Reminder:
// Next.js uses the App component to initialize pages.
// To override, create the ./pages/_app.js file and override the App class

const Application = ({ Component, pageProps, sessionData }: ExpectedAny) => (
	<React.Fragment>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</Head>
		<Context sessionData={sessionData}>
			<Theme>
				<Component {...pageProps} />
			</Theme>
		</Context>
	</React.Fragment>
);

// This loads the session data before the app starts so the user UI is already logged in.

Application.getInitialProps = async (obj: ExpectedAny) => {
	try {
		const cookie = obj?.ctx?.req?.headers?.cookie || null;

		const data = await getUserDefaultSessionData(cookie);

		return { sessionData: data };
	} catch (err) {
		return { sessionData: null };
	}
};

export default Application;
