import { loadBusinesses } from './components/core';

import './components/commands';
import './components/tasks';
import './components/events';

// Loading the business subsystems

import './systems/clothes';
import './systems/tunning';
import './systems/generalStore';
import './systems/gasStations';
import './systems/ammuNation';

mp.events.add('gamemodeStarted', () => loadBusinesses());
