// Thanks to rollup as of 31.05.2022 we can't have dynamic imports.
// We're forced to do static imports like savages.

// Natives

import '@natives/vehicles';
import '@natives/blips';
import '@natives/checkpoints';
import '@natives/markers';
import '@natives/meta';
import '@natives/objects';
import '@natives/text3D';
import '@natives/timers';
import '@natives/commands';
import '@natives/countdown';
import '@natives/items';
import '@natives/colshapes';
import '@natives/dialogs';
import '@natives/pickups';
import '@natives/browser';
import '@natives/actors';
import '@natives/weapons';
import '@natives/playerAttachments';
import '@natives/animations';
import '@natives/chat';
import '@natives/progressBar';
import '@natives/audio';
import '@natives/conversation';

// Legacy: Bigger systems that are a crucial part of the gamemode

import '@legacy/authentication';
import '@legacy/configurations';
import '@legacy/businesses';
import '@legacy/garages';
import '@legacy/groups';
import '@legacy/houses';
import '@legacy/inventory';
import '@legacy/licenseCenter';
import '@legacy/phone';
import '@legacy/playerList';
import '@legacy/profile';
import '@legacy/dialogs';
import '@legacy/safeBox';
import '@legacy/houseStorages';
import '@legacy/vehicles';
import '@legacy/vehiclesRenting';
import '@legacy/socket.io';
import '@legacy/dealership';
import '@legacy/characterCreator';
import '@legacy/welcome';
import '@legacy/tablet';
import '@legacy/speakers';
import '@legacy/playerWeapons';
import '@legacy/antiCheat';

// Factions
import '@legacy/factions/hospital';

// General: Small systems
import '@general/adminCommands';
import '@general/afk';
import '@general/anims';
import '@general/chatCommands';
import '@general/death';
import '@general/deviceInfo';
import '@general/experience';
import '@general/gameTimeSession';
import '@general/localChat';
import '@general/factionCivillian';
import '@general/misc';
import '@general/miscExtensions';
import '@general/miscLangs';
import '@general/money';
import '@general/beachCoins';
import '@general/paycheck';
import '@general/payday';
import '@general/safezone/index';
import '@general/weather';
import '@general/newbie';
import '@general/engine';
import '@general/odometer';
import '@general/testerToolkit';
import '@general/actions';
import '@general/translations';
import '@general/carRadio';
import '@general/playersStatistics';
import '@general/toasts';
import '@general/alerts';
import '@general/phoneSettings';
import '@general/walkieTalkie';
import '@general/dices';
import '@general/pedestrians';
import '@general/voice';
import '@general/worldChat';
import '@general/thirstHunger';
import '@general/alcohol';
import '@general/minimap';
import '@general/blockedNumbers';
import '@general/offers';
import '@general/vespify';
import '@general/mechanicalToolkit';
import '@general/settings';
import '@general/spawn';
import '@general/licenses';

// @Start listening to Socket Events
// This must be at the very end to make sure the array of socket events contains all of them.

import '@legacy/socket.io/components/socketEventsListener';
