// Components..

import { loadTranslations } from './components/core';

// Loading on gamemode booting

mp.events.add('gamemodeStarted', () => loadTranslations());
