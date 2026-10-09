import './components/events';
import './components/keys';
import './components/callbacks';

// Systems
import './systems/bullets';
import './systems/antiCheat';

// Disabled unequipping the weapon when it runs out of ammo.
// @ts-ignore @Reminder: This shit with game1 is needed according to the RAGE:MP dev.
mp.game1.unequipEmptyWeapon = false;
