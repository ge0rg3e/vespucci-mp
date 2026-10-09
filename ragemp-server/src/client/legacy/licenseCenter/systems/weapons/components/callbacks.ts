import * as rpc from 'rage-rpc';
import gameHashes from '@client/utils/gameHashes';
import { clearTestDependencies, createShotingTargets, examChecks, lowerNextTarget, setExamCheckTimerId, setExamStartedAt, targetObject } from './functions';
import { startCountdown } from '@client/natives/countdown/components/functions';
import { setInterfaceIsDisabled } from '@client/natives/interfaces';

rpc.on('ammuNation.licenseCenter@setCameraBehindPlayer', async () => {
	// Reset camera to set it behind player..
	mp.game.cam.setFollowPedCamViewMode(0);
	mp.game.invoke(gameHashes.SET_GAMEPLAY_CAM_RELATIVE_HEADING, 0);
});

rpc.on('ammuNation.licenseCenter@startExam', async () => {
	// We start the countdown (is a async) and wait for 5 seconds.
	await startCountdown({ identifier: 'ammuNation.licenseCenter@exam', seconds: 5 });

	// Mark exam started
	setExamStartedAt(new Date());
	setExamCheckTimerId(setInterval(examChecks, 500));

	// Inform the server the countdown finished to unfreeze the player
	rpc.triggerServer(`ammuNation.licenseCenter@onCountdownFinished`);

	// @Action: Create the dynamic objects that the player must shot down.
	createShotingTargets();

	// Disable inventory to avoid problems.
	setInterfaceIsDisabled('inventory', true);
	setInterfaceIsDisabled('phone', true);

	// Now let's lower a random object down.
	lowerNextTarget(true);
});

rpc.on('ammuNation.licenseCenter@stopExam', async () => {
	// Delete the test dependencies: Objects, variables etc.
	clearTestDependencies();

	// Reset this
	setInterfaceIsDisabled('inventory', false);
	setInterfaceIsDisabled('phone', false);
});
