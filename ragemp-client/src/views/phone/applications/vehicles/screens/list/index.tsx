import { AppState } from '../..';
import { useState } from 'react';

// components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';
import Entry from './components/entry';

const Component = () => {
	const { data, setSelectedVehicle, setScreen, lang } = AppState();
	const [selectedVeh, setSelectedVeh] = useState(false);

	const selectVehicle = (v: FixableAny) => {
		if (selectedVeh === true) return false;
		setSelectedVeh(true);

		setTimeout(() => {
			const index = data.vehicles.findIndex((veh: FixableAny) => veh.id === v.id);
			if (index === -1) return false;
			setSelectedVehicle(index);
			setSelectedVeh(false);
			setScreen('menu');
		}, 400); // for ux better
	};

	const getVehiclesListed = () =>
		data.vehicles.sort(
			// @ts-ignore-next-line
			(a: FixableAny, b: FixableAny) => new Date(a.createdAt) - new Date(b.createdAt)
		);

	return (
		<div className="screen list">
			<NavigationHeader title={lang.get('AppHeader_List')} />
			<div className="entries">
				<ScrollableContainer className="padding-container">
					{getVehiclesListed().map((entry: FixableAny, ix: number) => (
						<Entry key={ix} data={entry} selectVehicle={selectVehicle} />
					))}
				</ScrollableContainer>
			</div>
		</div>
	);
};

export default Component;
