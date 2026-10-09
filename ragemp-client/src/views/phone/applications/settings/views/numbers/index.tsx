import { AppState } from '../..';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import BlockedNumbers from './components/blockedNumbers';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack('PHONE_APP_SETTINGS_NUMBERS', LanguagePack);

const Component = () => {
	const lang = i18n.getLanguagePack('PHONE_APP_SETTINGS_NUMBERS', window.language);
	const { setSubRoute } = AppState();

	return (
		<>
			<NavigationHeader
				goBack={() => setSubRoute('menu')}
				title={lang.get('Header')}
				theme="dark"
			/>
			<BlockedNumbers />
		</>
	);
};

export default Component;
