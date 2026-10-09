export type Props = {
	children: ExpectedAny;
	withoutLayout?: boolean;
	title: string;
	withoutContainers?: boolean;
	meta?: {
		description?: string;
		keywords?: string;
		author?: string;
	};
	facebookOpenGraph?: {
		title?: string;
		description?: string;
		image?: {
			url: string;
			height: number;
			width: number;
		};
	};
	classNames?: string;

	breadcrumbs?: Array<
		| {
				label: string;
				icon: string;
				// eslint-disable-next-line
		  }
		| { shortcut: string }
	>;
};
