// Loading the houses on gamemode booting

import { loadRentingLocations } from './components/core';

import './components/events';
import './components/extensions';
import './components/langs';
import './components/items';
import './components/dialogs';
import './components/tasks';
import './components/commands';

mp.events.add('onVehiclesNativesLoaded', () => loadRentingLocations());
