import React, { useState } from 'react';

// Needed for some reason that I cannot remember. I believe it has to do with translatin the dates.
import '@/utils/moment';

// Components
import CrashBoundary from './views/systems/crash';
import AppContext from './utils/context';
import ThemeProvider from './utils/theme';
import AppRouter from './utils/router';

// Background Processes
import BackgroundServices from './services';

const MainApplication = () => (
	<React.Fragment>
		<CrashBoundary>
			<BackgroundServices>
				<AppContext>
					<ThemeProvider>
						<AppRouter />
					</ThemeProvider>
				</AppContext>
			</BackgroundServices>
		</CrashBoundary>
	</React.Fragment>
);

export default MainApplication;
