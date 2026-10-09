export type playerAnimation = {
	dict: string;
	name: string;
	speed: number;
	flags: number;
	duration?: number;
	speedMultiplier?: number;
};

declare global {
	interface PlayerMp {
		// This are the animations that we tracked to them as an an array
		animations: Array<playerAnimation> | undefined;
	}
}
