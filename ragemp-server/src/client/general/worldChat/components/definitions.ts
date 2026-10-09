// This means: the user can up to 30 meters (gta meters) away from us. If he's farer than that he's disconnected.
// Also this decides how loud his voice should sound.

// @Reminder: Leave this here. We need this every 300 ms. We don't want to call the server every 300 seconds.

export const localVoiceRangeDistances: ExpectedAny = {
	normal: 22.5,
	whisper: 5,
	shout: 30
};
