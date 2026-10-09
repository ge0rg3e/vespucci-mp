import { AppState } from '../../index';

// Components
import SubMenus from '../../components/subMenus';
import Header from './components/header';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
i18n.createLanguagePack('PHONE_APP_SETTINGS_MENU', LanguagePack);

const Component = () => {
	const lang = i18n.getLanguagePack('PHONE_APP_SETTINGS_MENU', window.language);
	const { setSubRoute, search } = AppState();

	const items = [
		{
			label: lang.get('SubMenu.Sounds'),
			icon: 'fas fa-volume',
			color: '#ff315b',
			type: 'redirect',
			id: 'sounds'
		},
		{
			label: lang.get('SubMenu.Numbers'),
			icon: 'fas fa-phone',
			color: '#33d258',
			type: 'redirect',
			id: 'numbers'
		}
	];

	const filtredItems = () => {
		if (!search.length) return items;

		return items.filter((x: ExpectedAny) => {
			if (x.space) return;
			return x.label.toLowerCase().includes(search.toLowerCase());
		});
	};

	return (
		<>
			<Header />
			<SubMenus
				onClick={(item) => {
					if (item.type === 'redirect') setSubRoute(item.id);
				}}
				items={filtredItems()}
			/>
		</>
	);
};

export default Component;
