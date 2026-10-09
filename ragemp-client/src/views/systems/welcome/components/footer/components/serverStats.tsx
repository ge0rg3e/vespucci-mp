import { formatNumber } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
//  Language
import * as i18n from '@vmp/i18n';
import Language from './serverStats.language';
const LANGUAGE_KEY = 'welcome:serverStats';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	const [data, setData] = useState({
		playersOnline: 0,
		last24Hours: 0,
		accountsRegistered: 0,
		businesses: [0, 0],
		houses: [0, 0],
		version: '1.0.0'
	});
	const getData = async () => {
		if (window.mp.fake) return false;
		const res = await window.rpc.callServer(`welcome:getServerStats`);
		setData(res);
	};

	useEffect(() => {
		getData();
	}, []);

	const entries = [
		{
			id: `playersOnline`,
			value: `${data.playersOnline}/1000`
		},

		{
			id: 'last24Hours',
			value: `${data.last24Hours}`
		},
		{
			id: `accountsRegistered`,
			value: `${formatNumber(data.accountsRegistered)}`
		},
		{
			id: `businesses`,
			value: `${data.businesses[0]}/${data.businesses[1]}`
		},
		{
			id: `houses`,
			value: `${data.houses[0]}/${data.houses[1]}`
		},
		{
			id: 'version',
			value: `v${data.version}`
		}
	];

	return (
		<React.Fragment>
			<div className="block serverStats">
				<div className="header">
					<div className="label">Server Statistics</div>
				</div>
				<div className="entries">
					{entries.map((entry, ix) => (
						<div key={ix} className={`entry ${ix < 4} mb`}>
							<div className="content">
								<div className="icon">
									<div
										className="image"
										style={{
											backgroundImage: `url("/assets/images/systems/welcome/icons/${entry.id}.png")`
										}}
									></div>
								</div>
								<div className="details">
									<div className="label">{lang.get(entry.id)}</div>
									<div className="value">{entry.value}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
