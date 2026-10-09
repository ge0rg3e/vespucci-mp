import './components/events';
import './components/callbacks';

// Tasks
import { adjustVoiceVolumes } from './components/tasks';

setInterval(() => {
	// Task to adjust voice channels volumes.
	adjustVoiceVolumes();
}, 300);
