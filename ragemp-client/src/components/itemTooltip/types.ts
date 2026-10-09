export type ComponentProps = {
	// Information
	containerElementId: string /* The id of the container div that sets the boundaries limits */;
	itemTypes: Array<string> /* The data-type that will trigger a tooltip. Some systems have more than one, ex: pickup, house, item. */;
	tooltipClassName?: String /* If you want to pass any clasname to the tooltip. */;

	// Functions..
	getItemById: (
		type: string
	) => ExpectedAny | null /* The function is needed to fetch the item data by id when hoevred */;
	renderTooltip: (data: ExpectedAny) => ExpectedAny;
	isDisabled?: () => boolean /* Allows us to disable the whole events for whatever reason if needed */;
	onMounted?: () => void /* Event that gets triggered when component is mounted. */;
};
