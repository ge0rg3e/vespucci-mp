export const getMenuItems = (lang: ExpectedAny, data: ExpectedAny) => {
	const arr = [
		{
			label: lang.get('Option:Set'),
			payload: {
				type: `set`
			}
		},
		{
			label: lang.get('Option:Reset'),
			payload: {
				type: `reset`
			}
		},
		{
			label: lang.get('Option:Teleport'),
			payload: {
				type: `teleport`
			}
		},
		{
			label: lang.get('Option:ToggleGhostMode'),
			payload: {
				type: `toggleGhostMode`,
				state: data.currentValues.ghostMode
			}
		}
	];

	return arr;
};
