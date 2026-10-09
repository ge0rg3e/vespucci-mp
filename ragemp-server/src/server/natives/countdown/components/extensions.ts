import * as rpc from 'rage-rpc';

mp.Player.prototype.startCountdown = function ({ identifier, seconds }: ExpectedAny) {
	this.triggerClientEvent('countDown@start', { identifier, seconds });
};

mp.Player.prototype.stopCountdown = function (identifier: string) {
	this.triggerClientEvent('countDown@stop', { identifier });
};

mp.Player.prototype.hasCountdown = function (identifier: string) {
	return rpc.callClient(this, 'countDown@hasCountdown', JSON.stringify({ identifier }));
};

declare global {
	interface PlayerMp {
		startCountdown(props: { identifier: string; seconds: number }): void;
		stopCountdown(identifier: string): void;
		hasCountdown(identifier: string): Promise<boolean>;
	}
}

export {};
