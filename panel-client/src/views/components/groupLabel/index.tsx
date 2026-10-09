import { Props } from './types';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
import { getSpecialClassNames } from '../username';
const TranslationPack = createComponentLanguage('groupLabel', ComponentLanguages);

const Component = (props: Props) => {
	const lang = getComponentLanguage(TranslationPack);

	const getLabelText = () => {
		const group = props.account.groups.split(',')[0];
		const level = group.split(':').pop();

		if (group.includes('owner')) return lang.get('owner');
		if (group.includes('admins')) return lang.get('admins', { level: level });
		if (group.includes('developers')) return lang.get('developers');
		if (group.includes('helpers')) return lang.get('helpers', { level: level });

		return lang.get('Civillian');
	};

	return <div className={`component-group component-shared-group-colors ${getSpecialClassNames(props.account)} ${props.className || ''}`}>{getLabelText()}</div>;
};

export default Component;
