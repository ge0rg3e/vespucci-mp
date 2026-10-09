import { useEffect, useState } from 'react';
import { ComponentState, Player } from '..';

// Components
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Button, ButtonBase } from '@mui/material';

const Component = (props: UndefinedAny) => {
	const [selected, setSelected] = useState<null | number>(null);
	const { data, tab, lang, search } = ComponentState();

	useEffect(() => {
		setSelected(null);
	}, [tab]);

	const disabledForNow = async () =>
		window.toast({ type: 'info', message: `This feature will be added later` });

	return (
		<div className="list">
			{props.players.map((player: Player, index: number) => (
				<ClickAwayListener
					key={index}
					onClickAway={() => {
						if (selected === player.id) {
							setSelected(null);
						}
					}}
				>
					<ButtonBase
						className={`entry ${
							data && player.id === data.localInfo.id && `not-selectable`
						} ${selected === player.id && `selected`}`}
					>
						<div
							className="top-area"
							onClick={() =>
								setSelected(
									selected === player.id || player.id === data?.localInfo.id
										? null
										: player.id
								)
							}
						>
							<div className="information">
								<div className="id">{player.id}</div>
								<div className="name">{player.username}</div>
							</div>
							<div className="badges">
								{player.admin && !player.developer ? (
									<div className="badge admin">Admin {player.admin}</div>
								) : null}
								{player.developer && <div className="badge admin">Developer</div>}
							</div>
						</div>
						{selected === player.id && (
							<div className="bottom-area">
								<div className="buttons">
									<Button
										variant="outlined"
										color="primary"
										onClick={disabledForNow}
									>
										{lang.get('ReportPlayer')}
									</Button>
									<Button
										variant="outlined"
										color="primary"
										onClick={disabledForNow}
									>
										{lang.get('MutePlayer')}
									</Button>
								</div>
							</div>
						)}
					</ButtonBase>
				</ClickAwayListener>
			))}
			{props.players.length < 1 && (
				<div className="no-players">
					<div className="icon-container">
						<i className="elm fa-solid fa-users-slash"></i>
					</div>
					<div className="label">
						{search.length > 0 ? lang.get('SearchNoMatch') : lang.get('EmptyList')}
					</div>
				</div>
			)}
		</div>
	);
};

export default Component;
