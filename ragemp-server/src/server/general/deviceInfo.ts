import * as rpc from 'rage-rpc';

interface DeviceInfo {
	city: string;
	country: string;
	region: string;
	ip: string;
}

// When player joins the game I must get his device info.
rpc.register('updateClientMeta', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { client_location, cef_version } = JSON.parse(args);
		player.client_location = client_location;
		player.cef_version = cef_version;
		return true;
	} catch (err) {
		return false;
	}
});

declare global {
	interface PlayerMp {
		client_location: DeviceInfo;
		cef_version: string;
	}
}
