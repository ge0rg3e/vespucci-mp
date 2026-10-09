export type Props = {
	type: 'circular';
	size: 'medium' | 'small' | 'large';
	username: string;
	className?: string;
	redirect?: boolean;
	onClick?: ExpectedAny;
};
