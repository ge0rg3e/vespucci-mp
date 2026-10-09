import React, { useState, useEffect } from 'react';

// Components
import Details from './components/details';
import Bar from './components/bar';
import Buff from './components/buff';
import WantedLevel from './components/wantedLevel';

// Context
import { AppContext } from '@/utils/context';
import { logError } from '@/utils/helpers';

// Variables
let timerInterval: ExpectedAny = null;

const Component = () => {
	const { minimapAnchor, minimapEnlarged } = AppContext();

	const getStyling = () => {
		if (window.mp.fake) {
			return {
				bottom: `unset`,
				top: '0px',
				right: '300px',
				height: '250px'
			};
		}

		if (minimapEnlarged) {
			return {
				bottom: `unset`,
				top: `20px`,
				right: `18px`,
				height: `250px`
			};
		}

		// We need to calculate the padding to fit within map.
		let bottomPadding = 2.2; // 2.3 => mai in jos

		if (window.screen.width < 1600) {
			bottomPadding = 3.5;
		}

		if (window.screen.width < 1400) {
			bottomPadding = 4;
		}

		return {
			// background: 'blue',
			bottom: `calc(${minimapAnchor.topY * 100}% - ${bottomPadding}vh)`,
			right: `calc(${minimapAnchor.rightX * 100}% + 3vw)`,
			height: `calc(${minimapAnchor.height * 100}%)`
		};
	};

	const [data, setData] = useState({
		time: { hour: 16, minutes: 20 },
		money: window.mp.fake ? 5000 : 0,
		health: 100,
		armour: 0,
		wantedLevel: 0,
		buffs: {
			hunger: 100,
			thirst: 100,
			alcohol: 0,
			drugs: 0
		}
	});

	const getData = async () => {
		try {
			if (window.mp.fake) return false;

			// Get
			const time = await window.rpc.callClient(`getGameClientTime`);
			const { health, armour, buffs } = await window.rpc.callClient(`hud:player.getData`);

			// Set
			setData((currentState) => {
				return {
					...currentState,
					time,
					health,
					armour,
					buffs
				};
			});
		} catch (err) {
			await logError(`hud.player.getData`, err);
		}
	};

	const setMoney = async (args: string) => {
		try {
			const { value } = JSON.parse(args);

			// Set it..
			setData((currentState) => ({ ...currentState, money: value }));
		} catch (err) {
			await logError(`hud.player.setMoney`, err);
		}
	};

	useEffect(() => {
		timerInterval = setInterval(getData, 1000);

		// Call for first time..
		getData();

		// Listener
		window.rpc.on('hud:player.setMoney', setMoney);

		return () => {
			if (timerInterval !== null) {
				// Clear interval
				clearInterval(timerInterval);

				// Reset id
				timerInterval = null;
			}

			window.rpc.off('hud:player.setMoney', setMoney);
		};
	}, []);

	return (
		<React.Fragment>
			<div
				className={`component-player ${minimapEnlarged && 'minimapEnlarged'}`}
				style={getStyling()}
			>
				<Details time={data.time} money={data.money} />
				<div className="bars">
					<Bar id="hp" proccent={data.health} />
					{data.armour ? <Bar id="armour" proccent={data.armour} /> : null}
				</div>
				<WantedLevel level={data.wantedLevel} />
				<div className="buffs">
					<Buff id="hunger" proccent={data.buffs.hunger} />
					<Buff id="thirst" proccent={data.buffs.thirst} />
					{data.buffs.alcohol ? (
						<Buff id="alcohol" proccent={data.buffs.alcohol} />
					) : null}
					{data.buffs.drugs ? <Buff id="drugs" proccent={data.buffs.drugs} /> : null}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
