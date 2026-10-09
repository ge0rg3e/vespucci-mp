import React, { useState } from 'react';
import { PageState } from '../..';

// Dependencies
import { formatActionMessage } from './functions';

// Components
import Avatar from '@components/avatar';
import DateFormatter from '@components/date';

// Create the language pack..
import ComponentLanguages from './languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('homepage.actions', ComponentLanguages);

// Components
import Type from './components/tabs';

const Component = () => {
	const { actions } = PageState();
	const lang = getComponentLanguage(TranslationPack);
	const [type, setType] = useState('factions');

	const filteredData = actions.filter((a: ExpectedAny) => a.type === type);

	return (
		<React.Fragment>
			<div className="actions">
				<div className="header">
					<div className="heading">{lang.get('Actions')}</div>
					<Type value={type} setValue={setType} />
				</div>
				<div className="entries">
					{filteredData.map((action: ExpectedAny, i: number) => (
						<div className={`component-actions-entry entry ${filteredData.length < 2 && 'single'}`} key={i}>
							<div className="line" />
							<Avatar type="circular" size="medium" username={action.account.username} redirect={true} />
							<div className="content">
								<div className="message" dangerouslySetInnerHTML={{ __html: formatActionMessage(action) }} />
								<div className="timestamp">
									<DateFormatter data={action.createdAt} format="fullDate" />
								</div>
							</div>
						</div>
					))}
					{filteredData.length < 1 && (
						<div className="component-actions-entry entry no-entries">
							<div className="content">
								<div className="message">
									<p>{lang.get('noActions')}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
