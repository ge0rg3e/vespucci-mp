import React from 'react';
import { formatActionMessage } from '../../../homepage/components/actions/functions';
import { PageState } from '../..';

// Components
import Date from '@components/date';
import Avatar from '@components/avatar';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.actions', ComponentLanguages);

const Component = () => {
	const { data } = PageState();

	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className="block-actions">
				<div className="component-card">
					<div className="component-heading">{lang.get('heading')}</div>
					<div className="entries">
						{data.actions.length < 1 && (
							<div className="component-actions-entry entry no-entries">
								<div className="content">
									<div className="message">{lang.get('noActions')}</div>
								</div>
							</div>
						)}
						{data.actions.slice(0, 10).map((action: ExpectedAny, i: number) => (
							<div className={`component-actions-entry entry ${data.actions.length < 2 && 'one-item'}`} key={i}>
								<div className="line" />
								<Avatar type="circular" size="medium" username={action.account.username} redirect={true} />
								<div className="content">
									<div className="message" dangerouslySetInnerHTML={{ __html: formatActionMessage(action) }} />
									<div className="timestamp">
										<Date format="fullDate" data={action.createdAt} />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
