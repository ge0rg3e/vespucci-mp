import { loadVehicles } from './components/core';

// Components
import './components/commands';
import './components/callbacks';
import './components/events';
import './components/langs';
import './components/tasks';
import './components/extensions';

// Loading on gamemode booting

mp.events.add('onVehiclesNativesLoaded', () => loadVehicles());
