import { loadNativeVehicles } from './components/core';
import './components/extensions';
import './components/events';

// Temporary bugfixes (hopefully)
import './bugfixes/damageEvent';
import './bugfixes/setPosition';

mp.events.add('gamemodeStarted', () => loadNativeVehicles());
