import React from 'react';
import { PageState } from '../..';

// Components
import GroupLabel from '@components/groupLabel';
import Username from '@components/username';
import Avatar from '@components/avatar';
import Date from '@components/date';

// Dependencies
import { Button, IconButton } from '@mui/material';

// Create the language pack..
import ComponentLanguages from './index.languages';
import { createComponentLanguage, getComponentLanguage } from '@/utils/helpers';
const TranslationPack = createComponentLanguage('profiles.details', ComponentLanguages);

const Component = (props: ExpectedAny) => {
	const { data } = PageState();

	const lang = getComponentLanguage(TranslationPack);

	return (
		<React.Fragment>
			<div className={`widget-player-details ${props.isHeader ? 'is-header' : 'not-header'}`}>
				<div className="header">
					<div className="background"></div>
					<div className="content">
						<Avatar type="circular" size="large" username={data.username} />
						<Username className="username" account={data} />
						<GroupLabel className="group" account={data} />
					</div>
				</div>
				<div className="properties">
					<div className="top-grid">
						<div className="entry">
							<div className="content">
								<div className="label">{lang.get('level')}</div>
								<div className="value">{data.level}</div>
							</div>
						</div>
						<div className="entry middle">
							<div className="content">
								<div className="label">{lang.get('rank')}</div>
								<div className="value">Piña colada lover</div>
							</div>
						</div>
						<div className="entry">
							<div className="content">
								<div className="label">{lang.get('playingTime')}</div>
								<div className="value">
									{data.connectedTime} {lang.get('hours')}
								</div>
							</div>
						</div>
					</div>
					<div className="status">
						<div className="label">{lang.get('aboutMe')}</div>
						<div className="quote">
							<div className="arrow-up"></div>
							<div className="text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium voluptates autem suscipit neque saepe nobis!</div>
						</div>
						Lorem
					</div>
					<div className="information">
						<div className="entry full">
							<div className="label">{lang.get('faction')}</div>
							<div className="value">Civillian</div>
						</div>

						<div className="entry">
							<div className="label">{lang.get('level')}</div>
							<div className="value">{data.level}</div>
						</div>

						<div className="entry">
							<div className="label">{lang.get('playingTime')}</div>
							<div className="value">
								{data.connectedTime} {lang.get('hours')}
							</div>
						</div>

						<div className="entry">
							<div className="label">{lang.get('lastOnline')}</div>
							<div className="value">
								<Date data={data.lastLoggedInAt} format="fullDate" />
							</div>
						</div>
						<div className="entry">
							<div className="label">{lang.get('registerdDate')}</div>
							<div className="value">
								<Date data={data.createdAt} format="fullDate" />
							</div>
						</div>
					</div>
					<div className="buttons">
						<Button variant="text" color="primary" disabled={true}>
							{lang.get('makeComplaint')}
						</Button>
						<IconButton className="more-options disabled" disabled={true}>
							<i className="fa-solid fa-ellipsis-vertical"></i>
						</IconButton>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
