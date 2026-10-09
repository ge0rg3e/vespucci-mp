import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState } from 'react';

// Dependencies
import CDN from './components/cdn';
import Stylesheet from './components/stylesheet';

const Theme = (props: ExpectedAny) => {
	const [stylesheetLoaded, setStylesheetLoaded] = useState(false); // Waiting for the main CSS to load.

	const theme = createTheme({
		typography: {
			fontFamily: ['Rubik'].join(',')
		},
		palette: {
			mode: `dark`,
			primary: {
				main: '#f195ac'
			},
			secondary: {
				main: '#f4afc2'
			}
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<CDN />
			<Stylesheet onLoad={() => setStylesheetLoaded(true)} />
			{stylesheetLoaded ? props.children : null}
		</ThemeProvider>
	);
};

export default Theme;
