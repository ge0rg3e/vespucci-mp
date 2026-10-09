// Business type: Clothes
// Started: 9th October 2022.

import './components/events';
import './components/dialogs';
import './components/callbacks';
import './components/langs';
import './components/extensions';
import './components/sockets';
import './components/items';
import './components/commands';

import { loadClothes, reloadClothes } from './components/core';

// When gamemode starts..
mp.events.add('gamemodeStarted', loadClothes);

// When someone reloads the database
mp.events.add('refreshClothingDatabase', reloadClothes);
