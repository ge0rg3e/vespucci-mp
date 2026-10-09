import { loadGarages } from './components/core';

// Components
import './components/commands';
import './components/tasks';
import './components/events';
import './components/langs';
import './components/extensions';
import './components/dialogs';

// Loading the garages on gamemode booting

mp.events.add('gamemodeStarted', () => loadGarages());
