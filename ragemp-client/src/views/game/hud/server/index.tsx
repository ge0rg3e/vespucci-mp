import React, { useEffect, useState } from 'react';

// Context
import { AppContext } from '@/utils/context';

//  Dependencies
import { logError } from '@/utils/helpers';

// Variable
let timerInterval: ExpectedAny = null;

const Component = () => {
	const { isDarkEnvironment, gameSettings } = AppContext();

	const [data, setData] = useState({ players: 1, accountId: 0, fps: 0 });

	const getData = async () => {
		try {
			const players = await window.rpc.callClient(`getNumberOfPlayers`);
			const accountId = await window.rpc.callClient(`getAccountId`);

			setData((currentState) => ({ ...currentState, players, accountId }));
		} catch (err) {
			await logError(`hud.server.getData`, err);
		}
	};

	const onFPSSet = async (args: ExpectedAny) => {
		try {
			const { value } = JSON.parse(args);
			setData((currentState) => ({ ...currentState, fps: value }));
		} catch (err) {
			await logError('hud.fps.set', err);
		}
	};

	useEffect(() => {
		timerInterval = setInterval(getData, 5000);

		// Call for first time..
		getData();

		window.rpc.on('hud:setFPS', onFPSSet);

		return () => {
			clearInterval(timerInterval);
			window.rpc.off('hud:setFPS', onFPSSet);
		};
	}, []);

	return (
		<React.Fragment>
			<div className={`component-server ${isDarkEnvironment && 'dark-mode'}`}>
				<div className="header">
					<div className="logo"></div>
					<div className="texts">
						<div className="line1">VESPUCCI.MP</div>
						<div className="line2">STORYMODE RPG</div>
					</div>
				</div>
				<div className="information">
					<div className="entry">
						<div className="icon">
							<i className="elm fa-solid fa-users"></i>
						</div>
						<div className="value">{data.players}</div>
					</div>
					<div className="entry">
						<div className="icon text">ID</div>
						<div className="value">{data.accountId}</div>
					</div>
					{gameSettings.showFPS && (
						<React.Fragment>
							<div className="entry">
								<div className="icon text">FPS</div>
								<div className="value">{data.fps}</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
