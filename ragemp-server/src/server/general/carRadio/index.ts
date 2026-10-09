import { loadNativeRadios } from './components/core';
import './components/extenstion';
import './components/callbacks';
import './components/commands';
import './components/events';
import './components/langs';

mp.events.add('gamemodeStarted', () => loadNativeRadios());
