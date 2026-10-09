import { loggedIn } from '@client/natives/interfaces';
import { worldChat } from './components/tasks';

// Components
import './components/callbacks';

setInterval(() => {
	// Not logged in.
	if (!loggedIn) return false;

	// This will connect our local player to other players that are speaking accordingly.
	worldChat();

	return true;
}, 300);
