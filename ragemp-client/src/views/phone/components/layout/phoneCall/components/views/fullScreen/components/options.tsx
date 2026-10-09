import React from 'react';

// Components UI
import { ButtonBase } from '@mui/material';
import { ComponentState } from '../../../../';
import { getLanguagePack } from '@vmp/i18n';

const Component = () => {
	const { localData, participantData, setIsMuted, isMuted } = ComponentState();
	const lang = getLanguagePack('PHONE_LAYOUT_PHONECALL', window.language);

	const onRequestMute = () => {
		window.rpc.triggerServer(`phone:mute`);

		setIsMuted(!isMuted);
	};

	const onRequestBlock = () => {
		window.rpc.triggerServer(`phone:blockCaller`);
	};

	const getOptions = () => {
		const arr = [
			{
				id: `mute`,
				icon: isMuted === false ? `fas fa-microphone` : `fas fa-microphone-slash`,
				onClick: onRequestMute
			},
			{
				id: `keypad`,
				icon: `fas fa-solid fa-grid`,
				disabled: true
			},
			{
				id: `speaker`,
				icon: `fas fa-volume`,
				disabled: true
			},
			{
				id: `add-call`,
				icon: `fas fa-plus`,
				disabled: true
			},
			{
				id: `camera`,
				icon: `fas fa-video`,
				disabled: true
			},
			{
				id: `block-caller`,
				icon: `fas fa-ban`,
				onClick: onRequestBlock
			}
		];

		return arr;
	};

	// @Render this component only when we are active and we are either in a call , or we're calling the participant.
	const myStatus = localData.status;
	const partStatus = participantData.status;

	if (!(myStatus === 'active' && ['active', 'pending'].includes(partStatus))) return null;

	return (
		<React.Fragment>
			<div className="component-options">
				<div className="entries">
					{getOptions().map((opt: ExpectedAny, index) => (
						<div className={`entry`} key={index}>
							<div className={`content ${opt.disabled && 'disabled'}`} onClick={opt.onClick}>
								<ButtonBase className="icon">
									<i className={`elm ${opt.id} ${opt.icon}`}></i>
								</ButtonBase>
								<div className="label">{lang.get(`Options.${opt.id}`)}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
