import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

// Dependencies
import SimulatedData from './response';

const Component = () => {
	const [data, setData] = useState<Data | null>(SimulatedData);

	const onEventReceiveData = (data: FixableAny) => {
		setData(JSON.parse(data));
	};

	useEffect(() => {
		window.rpc.on('updateSpectateInformation', onEventReceiveData);

		return () => {
			window.rpc.off('updateSpectateInformation', onEventReceiveData);
		};
	}, []);

	if (data === null) return null;

	return (
		<div className="system-spectate">
			<div className="header">
				<div className="left">
					<span className="username">
						{data.username} ({data.id})
					</span>
				</div>

				<div className="right">
					<span className="ip">IP: {data.ip}</span>
				</div>
			</div>

			<div className="info">
				{data.displayedInfo.map((info, i) => (
					<div key={i} className="key">
						{info.name}: {info.value}
					</div>
				))}
			</div>

			<div className="footer">
				<div className="buttons">
					<Button variant="outlined" size="medium" fullWidth={true}>
						Spectate Off
					</Button>

					<Button variant="outlined" size="medium" fullWidth={true}>
						Quick Sanctions
					</Button>
				</div>
			</div>
		</div>
	);
};

// Types
type Data = {
	id: string | number;
	username: string;
	ip: string;

	displayedInfo: Array<{
		name: string;
		value: string | number;
	}>;
};

export default Component;
