// Dependencies
import { loadHouses } from './components/core';

// Components
import './components/commands';
import './components/spawn';
import './components/extension';
import './components/events';
import './components/langs';
import './components/functions';
import './components/callbacks';
import './components/dialogs';
import './components/tasks';

// Loading the houses on gamemode booting

mp.events.add('gamemodeStarted', () => loadHouses());
