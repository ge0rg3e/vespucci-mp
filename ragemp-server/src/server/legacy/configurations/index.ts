// Loading the business subsystems

import { loadConfigurations } from './components/core';

mp.events.add('gamemodeStarted', () => loadConfigurations());
