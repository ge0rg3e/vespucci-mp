import { ComponentState } from '../../../..';

// Language
import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import LanguagePack from './entry.language';
const LanguageSystemId = 'clothesManagement:List:Entry';
createLanguagePack(LanguageSystemId, LanguagePack);

const Component = (props: ExpectedAny) => {
	const { itemId, setItemId, changePedClothing, setTexturesFound } = ComponentState();
	const lang = getLanguagePack(LanguageSystemId, window.language);

	const onItemSelected = () => {
		setItemId(props.data.id);
		changePedClothing(
			props.data.type,
			{
				drawableId: props.data.drawableId,
				textureId: props.data.textureId,
				isAddon: props.data.isAddon
			},
			props.data.meta
		);
		setTexturesFound(props.data._textures);
	};

	const isSelected = () => {
		const src = props.data._textures.find((i: Clothes) => i.id === itemId);
		return src || props.data.id === itemId ? true : false;
	};

	const isAvailable = () => {
		const src = props.data._textures.find((i: Clothes) => i.isAvailable === true);
		return src || props.data.isAvailable === true ? true : false;
	};

	return (
		<div
			className={`entry ${isSelected() ? 'selected' : 'not-selected'}`}
			id={`entry-${props.data.id}`}
			onClick={onItemSelected}
		>
			<div className={`textures ${isAvailable() ? 'available' : 'not-available'}`}>
				{props.data._textures.length}
			</div>
			<div className="details">
				<div className={`name ${props.data.name.length < 1 ? 'no-name' : ''}`}>
					{props.data.name || lang.get('Nameless')}
				</div>
				<div className="data">Drawable Id: {props.data.drawableId}</div>
			</div>
			<div className="badges">
				{props.data._hasVipTexture && <div className="badge vip">VIP</div>}
				{props.data.isAddon && <div className="badge dlc">ADDON</div>}
			</div>
		</div>
	);
};

export default Component;
