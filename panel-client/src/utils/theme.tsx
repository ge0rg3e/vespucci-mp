import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import React from 'react';

const Theme = (props: ExpectedAny) => {
	const theme = createTheme({
		typography: {
			fontFamily: ['Sohne'].join(','),
			fontSize: 14
		},
		palette: {
			text: {
				primary: '#888c9f'
			},
			mode: `dark`,
			primary: {
				main: '#f195ac'
			},
			secondary: {
				main: '#f4afc2'
			},
			background: {
				default: '#0F111B',
				paper: '#151825'
			}
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{props.children}
		</ThemeProvider>
	);
};

export default Theme;
