// Dependencies
import { renderActorTags, renderPlayerNametags } from './components/task';

// Disabling original nametags.
mp.nametags.enabled = false;

// Events needed
mp.events.add('render', renderPlayerNametags);
mp.events.add('render', renderActorTags);

// // When debugging events
// setInterval(renderPlayerNametags, 300);
// setInterval(renderActorTags, 300);
