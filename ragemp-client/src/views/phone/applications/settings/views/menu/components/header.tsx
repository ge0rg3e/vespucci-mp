import { getLanguagePack } from '@vmp/i18n';
import { AppState } from '../../..';

// Components
import ProfileCard from './profileCard';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_SETTINGS_MENU', window.language);

	const { setSearch, search } = AppState();

	return (
		<div className="header">
			<div className="label">{lang.get('Header')}</div>

			<div className="search-bar">
				<i className="fat fa-magnifying-glass"></i>
				<input
					onChange={(e) => setSearch(e.target.value)}
					placeholder={lang.get('Search')}
					value={search}
					type="text"
				/>
			</div>

			{!search.length && <ProfileCard />}
		</div>
	);
};

export default Component;
