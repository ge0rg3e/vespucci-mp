import React from 'react';
import { ButtonBase, Button, Switch } from '@mui/material';
import { ComponentState } from '../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './options.laguage';
const LanguageSystemId = 'clothesManagement:List:Options';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = () => {
	const { leaveSystem, data, setData } = ComponentState();
	const { settings, setSettings } = ComponentState();

	const lang = getLanguagePack(LanguageSystemId, window.language);

	const changeGender = async () => {
		const newGender = data.clothing.gender === 'male' ? 'female' : 'male';

		let defaults = {};
		const dnaShapes =
			newGender === 'male'
				? { motherShape: 0, fatherShape: 8, shapeResemblance: 0.43, skinResemblance: 0.5 }
				: { motherShape: 8, fatherShape: 25, shapeResemblance: 1, skinResemblance: 0.71 };
		if (!window.mp.fake) {
			// Set skin to new sex..
			window.rpc.triggerServer(
				'charCreator:updateModel',
				JSON.stringify({
					model: newGender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01'
				})
			);

			defaults = await window.rpc.callServer(
				'clothing:getDefaultValues',
				JSON.stringify({
					gender: newGender
				})
			);
		}

		const newClothing = {
			...data.clothing,
			gender: newGender,
			beardModel: 255,
			...defaults,
			...dnaShapes
		};

		window.rpc.triggerServer(
			'clothing:applyPedClothing',
			JSON.stringify({
				clothes: newClothing
			})
		);

		setData({
			...data,
			clothing: newClothing
		});
	};

	const saveClothes = () => {
		if (window.mp.fake) return true;

		window.rpc.triggerServer(
			'manageClothes:saveCurrentOutfit',
			JSON.stringify({ clothes: data.clothing })
		);
	};

	return (
		<React.Fragment>
			<div className="options">
				<div className="opts-entries">
					<ButtonBase className="opts-entry" onClick={changeGender}>
						<div className="label">{lang.get('SwapGender')}</div>
					</ButtonBase>
					<ButtonBase className="opts-entry" onClick={saveClothes}>
						<div className="label">{lang.get('SaveClothes')}</div>
					</ButtonBase>
					{data.permissions.update && (
						<React.Fragment>
							{settings.advancedEditing && data.permissions.create && (
								<React.Fragment>
									<ButtonBase
										className="opts-entry"
										disabled={!data.permissions.update}
										onClick={() => setSettings('createClothing', true)}
									>
										<div className="label">{lang.get('CreateClothing')}</div>
									</ButtonBase>
								</React.Fragment>
							)}
							<ButtonBase
								className="opts-entry"
								disabled={!data.permissions.update}
								onClick={() =>
									setSettings('advancedEditing', !settings.advancedEditing)
								}
							>
								<div className="label">
									{lang.get('EditingMode', { bool: settings.advancedEditing })}
								</div>
							</ButtonBase>
						</React.Fragment>
					)}
				</div>
				<div className="quit">
					<div className="switch">
						<div className="controller">
							<Switch
								disabled={!data.permissions.update}
								checked={settings.saveChanges}
								onChange={() => setSettings(`saveChanges`, !settings.saveChanges)}
							/>
						</div>
						<div className="label">{lang.get('Save')}</div>
					</div>

					<Button
						variant="contained"
						color="secondary"
						onClick={() => leaveSystem(settings.saveChanges)}
					>
						{lang.get('Exit')}
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
