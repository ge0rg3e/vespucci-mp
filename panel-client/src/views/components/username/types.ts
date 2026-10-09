export type Props = {
	className?: string;
	account: {
		username: string;
		groups: string;
		factionId: number;
		factionRank: number;
		donorTier: number;
	};
	sparkling?: boolean;
	redirect?: boolean;
	size?: 'small' | 'medium' | 'large';
	useHref?: boolean;
};
