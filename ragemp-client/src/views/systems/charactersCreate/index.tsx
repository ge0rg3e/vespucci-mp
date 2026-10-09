import React, { useEffect, useState } from 'react';
import lodash from 'lodash';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Dependencies
import { fakeRPCEventResponse, interpetingRPCEvent, logError } from '@/utils/helpers';

// Utils
import MouseEvents from './utils/events';
import Context from './utils/context';
import Menu from './components/menu';

// Pages
import Heritage from './pages/heritage';
import Face from './pages/face';
import Traits from './pages/traits';
import Features from './pages/features';

// Demo data
import ResponseData from './response';
import DefaultData from './utils/defaultData';

// Lanaguage translation
import * as i18n from '@vmp/i18n';
import LanguagePack from './index.language';
const LanguagePackId = `SYSTEM_CHAR_CREATOR`;
i18n.createLanguagePack(LanguagePackId, LanguagePack);

const CharacterCreation = () => {
	const lang = i18n.getLanguagePack(LanguagePackId, window.language);
	const navigate = useNavigate();

	const [page, setPage] = useState('heritage');
	const [submitted, setSubmitted] = useState(false);

	const [data, setData] = useState<ExpectedAny>({
		clothes: {
			gender: 'male'
		},
		meta: { ...DefaultData.meta }
	});

	const updatePedPreview = async () => {
		if (window.mp.fake) return;
		window.rpc.triggerServer(
			'charCreator:updateClothes',
			JSON.stringify({ data: data.clothes })
		);
	};

	const updateData = (path: string, value: ExpectedAny) => {
		setData((currentState: ExpectedAny) => {
			const newData: ExpectedAny = { ...currentState };
			lodash.set(newData, path, value);
			return newData;
		});
	};

	useEffect(() => {
		if (Object.keys(data.clothes).length < 2) return;
		// Update clothes..
		updatePedPreview();
	}, [data]);

	useEffect(() => {
		if (window.mp.fake) return;
		// Update ped..
		const model = data.clothes.gender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
		window.rpc.triggerServer('charCreator:updateModel', JSON.stringify({ model }));
	}, [data.clothes.gender]);

	const resetCharacter = () => {
		setPage('heritage');
		changeGender(data.clothes.gender!);
		window.toast({ type: 'info', message: lang.get('PreferencesReset') });
	};

	const getClothesForGender = async (gender: string) => {
		try {
			fakeRPCEventResponse('Server', 'charCreator:GetClothesDefaultData', 200, ResponseData);
			const res = await interpetingRPCEvent(
				'Server',
				'charCreator:GetClothesDefaultData',
				JSON.stringify({ gender: gender === 'male' ? 'male' : 'female' })
			);

			return res;
		} catch (err) {
			throw err;
		}
	};
	const changeGender = async (newGender: string) => {
		try {
			// Get the default data for the new gender..
			const res = await getClothesForGender(newGender);

			// Update the interface and their data..
			setData({
				meta: { ...DefaultData.meta },
				clothes: res
			});
		} catch (err) {
			await logError(`CHANGE_GENDER`, err, { newGender });
		}
	};

	const loadDefaultClothes = async () => {
		try {
			// Get the default data from the server..
			const res = await getClothesForGender('male');

			// Update the response
			setData({
				clothes: res,
				meta: { ...DefaultData.meta }
			});
		} catch (err) {
			await logError(`LOAD_CHAR_CREATOR`, err);
			return false;
		}
	};

	const submitData = async () => {
		if (window.mp.fake) return false;
		try {
			setSubmitted(true);
			await interpetingRPCEvent(
				'Server',
				'charCreator:saveData',
				JSON.stringify({ data: data.clothes })
			);
			navigate('/');
		} catch (err: FixableAny) {
			let msg = lang.get(`ErrorTechnicalErrorClient`);
			if (err && err.statusCode) {
				switch (err.statusCode) {
					default: {
						msg = lang.get(`ErrorTechnicalErrorServer`);
						break;
					}
				}
			}

			window.toast({ type: 'error', message: msg });
			setSubmitted(false);
		}
	};

	useEffect(() => {
		loadDefaultClothes();
	}, []);

	const ComponentPages: ExpectedAny = {
		heritage: Heritage,
		face: Face,
		features: Features,
		traits: Traits
	};

	const ComponentRendered = ComponentPages[page];

	const PassedProps = {
		updateData,
		setData,
		data,
		page,
		setPage,
		changeGender
	};

	if (Object.keys(data.clothes).length < 2) return null;

	return (
		<React.Fragment>
			<MouseEvents />
			<div className="system-create-character">
				<Context passedProps={PassedProps}>
					<div className="menu-wrapper">
						<Menu />

						<div className="menu-content">
							<ComponentRendered />
						</div>
						<div className="menu-buttons">
							<Button
								disabled={submitted}
								className="reset-button"
								variant="outlined"
								onClick={resetCharacter}
							>
								{lang.get('ResetButton')}
							</Button>
							<Button
								disabled={submitted}
								variant="contained"
								color="primary"
								onClick={submitData}
							>
								{lang.get('SubmitButton')}
							</Button>
						</div>
					</div>
				</Context>
			</div>
		</React.Fragment>
	);
};

export default CharacterCreation;
