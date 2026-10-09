import './components/events';
import './components/callbacks';
import { createWelcomeConfiguration } from './components/functions';

// Create default config

mp.events.add('gamemodeStarted', () => {
	createWelcomeConfiguration();
});
