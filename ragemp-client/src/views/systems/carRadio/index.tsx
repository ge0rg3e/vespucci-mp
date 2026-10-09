import { AppContext } from '@/utils/context';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Context
const Context: ExpectedAny = createContext({});
export const ComponentState: ExpectedAny = () => useContext(Context);

//  Language
import * as i18n from '@vmp/i18n';
import Language from './language';
const LANGUAGE_KEY = 'SYSTEM_CAR_RADIO';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = () => {
	const [activeRadio, setActiveRadio] = useState<ExpectedAny>(null);
	const { isDarkEnvironment } = AppContext();
	const [previewRadio, setPreviewRadio] = useState(null);
	const [stations, setStations] = useState<Array<{ id: number | string; label: string; logo: string }>>([]);

	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	const getSources = () => {
		const arr = [...stations];

		arr.splice(11, 0, {
			label: 'OFF',
			id: 'off',
			logo: `${__ASSETS__}/images/carRadio/0.png`
		});

		return arr.reverse(); // is looking better reversed.
	};

	const onRadioSelected = (entry: ExpectedAny) => {
		const isOff = entry.id === activeRadio || entry.id == 'off' ? true : false;
		window.rpc.triggerServer(`carRadio:onOptionSelected`, JSON.stringify({ id: isOff ? null : entry.id }));
		setActiveRadio(isOff ? null : entry.id);
	};

	const getRadio = (isPreview = false) => {
		const arr = getSources();

		const match = arr.find((x) => x.id === (isPreview ? previewRadio : activeRadio));

		if (!match) return null;

		return match;
	};

	const isPreviewing = () => {
		if (previewRadio && previewRadio !== activeRadio) return true;
		return false;
	};

	const onReceivedData = (args: string): void => {
		const { stations: stationsList, currentStation } = JSON.parse(args);

		setStations(stationsList);

		if (currentStation) {
			const match = getSources().find((c) => c.id === currentStation);
			if (match) setActiveRadio(match.id);
		}
	};

	useEffect(() => {
		window.rpc.on('carRadio.receivedData', onReceivedData);
		window.rpc.triggerServer(`carRadio.requestData`);

		return () => {
			window.rpc.off('carRadio.receivedData', onReceivedData);
		};
	}, []);

	const ContextPassed = {};

	return (
		<Context.Provider value={ContextPassed}>
			<div className={`system-car-radio ${isDarkEnvironment && 'night-mode'}`}>
				<div className="entries" id="car-radio-entries">
					{getSources().map((entry: ExpectedAny, ix: number) => (
						<div
							className="entry"
							key={ix}
							onClick={() => onRadioSelected(entry)}
							onMouseOver={() => setPreviewRadio(entry.id)}
							onMouseLeave={() => setPreviewRadio(null)}
						>
							<div
								className={`content ${
									activeRadio === entry.id || (entry.id === 'off' && activeRadio === null)
										? entry.id === 'off'
											? 'active off'
											: 'active'
										: 'not-active'
								}  ${isDarkEnvironment && 'night-mode'}`}
							>
								<img
									onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
									className={`image`}
									src={entry.logo}
								/>
							</div>
						</div>
					))}
					<div className={`centered-position ${isDarkEnvironment && 'night-mode'}`}>
						{activeRadio === null && !isPreviewing() && (
							<React.Fragment>
								<div className="heading">{lang.get('TurnedOff:Heading')}</div>
								<div className="message">{lang.get('TurnedOff:Message')}</div>
							</React.Fragment>
						)}
						{activeRadio !== null && getRadio() && !isPreviewing() && (
							<div className="heading">{getRadio().label}</div>
						)}

						{isPreviewing() && getRadio(true) && getRadio(true).id !== 'off' && (
							<div className="heading">{getRadio(true).label}</div>
						)}

						{isPreviewing() && getRadio(true) && getRadio(true).id === 'off' && (
							<div className="heading">{lang.get('Off:Heading')}</div>
						)}
					</div>
				</div>
			</div>
		</Context.Provider>
	);
};

export default Component;
