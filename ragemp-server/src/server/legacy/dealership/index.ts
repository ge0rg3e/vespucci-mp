// Components
import './components/events';
import './components/extensions';
import './components/callbacks';
import './components/commands';
import './components/langs';
import './components/dialogs';

// Loading the dealerships on gamemode booting

import { loadDealerships } from './components/core';

mp.events.add('gamemodeStarted', () => loadDealerships());
