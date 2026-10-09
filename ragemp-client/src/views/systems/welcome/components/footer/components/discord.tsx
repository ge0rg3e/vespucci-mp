import { copyStringToClipboard, formatNumber, logError } from '@/utils/helpers';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

//  Language
import * as i18n from '@vmp/i18n';
import Language from './discord.language';
const LANGUAGE_KEY = 'welcome:discord';
i18n.createLanguagePack(LANGUAGE_KEY, Language);

const Component = () => {
	const [data, setData] = useState({
		members: []
	});

	const lang = i18n.getLanguagePack(LANGUAGE_KEY, window.language);

	const loadData = async () => {
		try {
			const { data: res } = await Axios.get(
				`https://discordapp.com/api/guilds/907012272759664700/widget.json`
			);
			setData(res);
		} catch (err) {
			await logError(`LOAD_DISCORD_DATA`, err);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const copyLink = () => {
		window.toast({
			type: 'success',
			message: lang.get('copySuccess')
		});
		copyStringToClipboard('https://discord.com/invite/f9yEyKcXZf');
	};

	if (data.members.length < 1) return null; // if discord is offline..

	return (
		<React.Fragment>
			<div className="block discord">
				<div className="header">
					<div className="left-side">
						<div className="label">Discord</div>
						<div className="stats">
							{formatNumber(data.members.length)} {lang.get('membersOnlineRightNow')}
						</div>
					</div>
					<div className="right-side">
						<Button variant="outlined" color="primary" onClick={copyLink}>
							{lang.get('copyInviteButton')}
						</Button>
					</div>
				</div>
				<div className="content">
					<div className="members">
						{data.members.map((member: ExpectedAny, ix) => (
							<div key={ix} className={`entry`}>
								<img src={member.avatar_url} alt={member.username} />
							</div>
						))}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
