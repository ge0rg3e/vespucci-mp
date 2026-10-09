export interface Props {
	metrics: Record<string, ExpectedAny>;

	chartData: Array<{
		date: Date;
		value: number;
	}>;

	actions: Array<{
		user: string;
		content: string;
		type: 'general' | 'staff';
	}>;
}
