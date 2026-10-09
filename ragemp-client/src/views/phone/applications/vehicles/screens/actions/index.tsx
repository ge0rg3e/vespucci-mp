import React from 'react';
import { AppState } from '../..';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';

// Custom components
import NormalActions from './components/normalActions';
import AdminActions from './components/adminActions';

const Component = () => {
	const { data, vehicleSelected, setScreen, lang } = AppState();

	const showNotSpawnedMessage = () => {
		window.phone.showAlert({
			title: lang.get('AlertNotSpawned:Title'),
			description: lang.get('AlertNotSpawned:Description', {
				inGarage: vehicleSelected.status === 2 ? true : false
			}),
			buttons: [
				{
					text: 'Ok',
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});
	};

	return (
		<React.Fragment>
			<div className="screen actions">
				<NavigationHeader
					title={vehicleSelected.extra.modelName}
					right={
						<React.Fragment>
							<div className="icon" onClick={() => setScreen('list')}>
								<i className={`fa-solid fa-arrow-up-arrow-down`}></i>
							</div>
						</React.Fragment>
					}
				/>
				<ScrollableContainer>
					<NormalActions showNotSpawnedMessage={showNotSpawnedMessage} />
					{data.remoteExtras.useAdminTools === true && <AdminActions />}
				</ScrollableContainer>
			</div>
		</React.Fragment>
	);
};

export default Component;
