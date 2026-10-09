declare global {
	interface PlayerVariables {
		animations: Array<{
			dict: string;
			name: string;
			speed: number;
			flags: number;
			duration?: number;
			speedMultiplier?: number;
		}>;
	}
}

export default {};
