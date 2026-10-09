import './components/events';
import './components/langs';

import { loadGasStations } from './components/functions';

mp.events.add('gamemodeStarted', () => loadGasStations());
