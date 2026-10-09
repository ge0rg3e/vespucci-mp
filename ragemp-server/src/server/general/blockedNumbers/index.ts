import { loadOnStartup } from './components/functions';

import './components/callback';

mp.events.add('gamemodeStarted', loadOnStartup);
