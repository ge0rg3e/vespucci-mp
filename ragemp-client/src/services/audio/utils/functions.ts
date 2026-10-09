export function dispatchAudioEvent(identifier: string, eventName: string, payload = {}) {
	document.dispatchEvent(
		new CustomEvent(`services.audio@${eventName}`, {
			detail: { identifier, payload }
		})
	);
}
