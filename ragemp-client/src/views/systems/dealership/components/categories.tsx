import { DealershipState } from '..';

// Components
import { ButtonBase } from '@mui/material';

// Dependencies
import { fakeAwait } from '@/utils/helpers';

// Language
import * as i18n from '@vmp/i18n';
import Language from './categories.lang';
const languagePackId = `SYSTEM_DEALERSHIP_CATEGORIES`;
i18n.createLanguagePack(languagePackId, Language);

const Component = () => {
	const lang = i18n.getLanguagePack(languagePackId, window.language);
	const { categories, setCategorySelected } = DealershipState();

	const selectCategory = async (entry: FixableAny) => {
		await fakeAwait(300);
		setCategorySelected(entry.name);
	};

	return (
		<div className="categories">
			<div className="content">
				<div className="header">
					<div className="heading">{lang.get('Heading')}</div>
					<div className="description">{lang.get('Description')}</div>
				</div>
				<div className="entries scroll-styled">
					{categories.map((entry: FixableAny, ix: number) => (
						<ButtonBase
							key={ix}
							className={`entry`}
							onClick={() => selectCategory(entry)}
						>
							<div className="name">{entry.name}</div>
						</ButtonBase>
					))}
				</div>
			</div>
		</div>
	);
};

export default Component;
