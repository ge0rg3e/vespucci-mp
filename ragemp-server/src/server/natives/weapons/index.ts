// Loading data
import { loadNativeWeapons } from './components/core';

// Components
import './components/callbacks';
import './components/langs';

mp.events.add('gamemodeStarted', () => loadNativeWeapons());
