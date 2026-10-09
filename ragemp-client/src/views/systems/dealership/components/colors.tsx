import React, { useEffect, useState } from 'react';
import { DealershipState } from '..';

// Dependencies
import { hexToRgb, isRGBFormat, isValidColor } from '@/utils/helpers';

// Components
import { TextField } from '@mui/material';

// Language
import * as i18n from '@vmp/i18n';
import Language from './colors.lang';
const languagePackId = `SYSTEM_DEALERSHIP_COLORS`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	// const lang = i18n.getLanguagePack(languagePackId, 'RO');

	const { colors, setColors } = DealershipState();
	const [active, setActive] = useState(false);
	const [inputRGB, setInputRGB] = useState<ExpectedAny>(null);

	const mappedColors = [
		'#1abc9c', //Turqoise,
		'#2ecc71', // Emerald
		'#34495e', // Grey
		'#FDA7DF', // pink
		'#5758BB', // dark move
		'#9b59b6', // Amethyst
		'#f1c40f', // Galben
		'#e74c3c', // Red
		'#B53471', // very berry
		'#ffffff', // white
		'#000000' // negru
	];

	const selectColor = (cRaw: string) => {
		const c = hexToRgb(cRaw, true);
		setColors([c, c]);
		setActive(false); // Dissalow the color pciker
	};

	const colorIsValid = () => {
		const check1 = isValidColor(`rgb(${inputRGB})`);
		const check2 = isRGBFormat(`rgb(${inputRGB})`);
		return check1 && check2 ? true : false;
	};

	const hasInputError = () =>
		inputRGB !== null && inputRGB.length > 0 ? (!colorIsValid() ? true : false) : false;

	useEffect(() => {
		if (inputRGB && inputRGB.length > 0 && hasInputError() === false) {
			const cToArr = inputRGB.split(',').map((x: string) => parseInt(x));
			setColors([cToArr, cToArr]);
		}
	}, [inputRGB]);

	const switchRGBCustom = () => {
		setActive(active ? false : true);
		setInputRGB(null);
	};

	const onVehicleColorChanged = () => {
		if (colors === null) return false;
		window.rpc.triggerClient('vehicleDealershipColorChanged', JSON.stringify({ colors }));
		return true;
	};

	useEffect(() => {
		onVehicleColorChanged();
	}, [colors]);

	return (
		<React.Fragment>
			<div className="colors">
				<div className="heading">{lang.get('Heading')}</div>
				<div className="entries">
					{mappedColors.map((c, key) => (
						<div key={key} className="entry">
							<div
								className="color"
								style={{ backgroundColor: c }}
								onClick={() => selectColor(c)}
							>
								{/* {key} */}
							</div>
						</div>
					))}
					<div className="entry custom" onClick={switchRGBCustom}>
						<div className="color custom">
							<i className="icon fa-solid fa-palette"></i>
						</div>
					</div>
				</div>
				{active === true && (
					<React.Fragment>
						<div className="heading custom-color">{lang.get('CustomRGBHeading')}</div>
						<div className="input-container">
							<TextField
								fullWidth={true}
								variant="standard"
								placeholder="255,255,255"
								value={inputRGB || ''}
								onChange={(ev: UndefinedAny) => setInputRGB(ev.target.value)}
								error={hasInputError() ? true : false}
								helperText={hasInputError() ? lang.get('NotValidColor') : undefined}
							/>
						</div>
					</React.Fragment>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
