import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { ViewState } from '..';

const Component = () => {
	const lang = getLanguagePack('PHONE_APP_PHONE_EDITCONTACT', window.language);
	const { data, setData } = ViewState();

	const onNotesChange = (ev: ExpectedAny) => {
		const newValue = ev.target.value;
		if (newValue.length > 200) return false;

		setData({
			...data,
			notes: newValue
		});
	};

	return (
		<React.Fragment>
			<div className="notes">
				<textarea
					placeholder={lang.get('Notes:placeholder')}
					defaultValue={data.notes || ''}
					onChange={onNotesChange}
					rows={5}
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
