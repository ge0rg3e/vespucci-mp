import { Html, Head, Main, NextScript } from 'next/document';

const PageDocument = () => (
	<Html>
		<Head>
			{/* Meta */}
			<link rel="shortcut icon" type="image/jpg" href="/assets/images/favicon.png" />
			<meta charSet="UTF-8" />

			{/* Font */}
			<link rel="preload" href="/assets/fonts/sohne.woff2" as="font" />

			{/* Addons */}
			<link rel="stylesheet" href="/assets/css/fontAwesome.css" />
			<link rel="stylesheet" href="/assets/css/animate.min.css" />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default PageDocument;
