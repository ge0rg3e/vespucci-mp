import { useContext, createContext, useEffect, useState } from 'react';
import { createAmplitudeEvent, MapComponent } from '@/utils/helpers';

// Views
import Stats from './views/stats';

// Components
import Menu from './components/menu';
import SpecialPoints from './components/specialPoints';

// Context
const Context = createContext({});
export const ProfileState: ExpectedAny = () => useContext(Context);

// Demo
import SimulatedResponse from './response';

const Component = () => {
	const [route, setRoute] = useState('stats');
	const [data, setData] = useState(null);

	const RoutesMapping: UndefinedAny = {
		stats: { component: MapComponent(Stats) }
	};

	const RouteComponent = RoutesMapping[route].component;

	const passedVariables = {
		setRoute,
		route,
		data,
		setData
	};

	const onProfileDataReceived = (data: ExpectedAny) => setData(data);

	useEffect(() => {
		createAmplitudeEvent('Game Profile');
		window.socket.on('onProfileDataReceived', onProfileDataReceived);

		// Faking a response so we can see the profile in the browser when simulating.
		if (window.mp.fake) {
			window.socket.simulateOn('onProfileDataReceived', SimulatedResponse);
		}
		return () => {
			window.socket.off('onProfileDataReceived');
		};
	}, []);

	if (data === null) return null;

	return (
		<Context.Provider value={passedVariables}>
			<div className="system-profile">
				<img
					src={`/assets/images/systems/profile/background.png`}
					onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
					onContextMenu={(e) => e.preventDefault()}
					onDragStart={(e) => e.preventDefault()}
					className={`background`}
				/>

				<div className="body-navigation">
					<div className="content">
						<Menu />
						<SpecialPoints />
					</div>
				</div>
				<div className={`body-container`}>
					<div className="body-content">
						<RouteComponent />
					</div>
				</div>
			</div>
		</Context.Provider>
	);
};

export default Component;
