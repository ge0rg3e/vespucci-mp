import { useState } from 'react';
import Login from './views/login';
import Register from './views/register';
import { AppContext } from '@/utils/context';

// Components
import MusicControl from '../welcome/components/header/components/music';

type AuthenticationView = 'login' | 'register';

const Authentication = () => {
	const [view, setView] = useState<AuthenticationView>('login');
	const { gameTime } = AppContext();

	const mappedViews = {
		login: (props: ExpectedAny) => <Login {...props} />,
		register: (props: ExpectedAny) => <Register {...props} />
	};

	const [isNight] = useState([0, 1, 2, 3, 4, 5, 23].includes(gameTime) ? true : false);

	const Component = mappedViews[view];

	const PassedProps = {
		view,
		setView
	};

	return (
		<div className="system-authenticate">
			<img
				src={`/assets/images/systems/authentication/background.png`}
				onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
				onContextMenu={(e) => e.preventDefault()}
				onDragStart={(e) => e.preventDefault()}
				className={`background ${isNight ? 'night-mode' : 'day-mode'}`}
			/>
			<MusicControl />
			<div className="boxed-content">
				<div className="left-side">
					<img
						src={`/assets/images/systems/authentication/character.png`}
						onLoad={(ev: UndefinedAny) => (ev.target.className += ` loaded`)}
						onContextMenu={(e) => e.preventDefault()}
						onDragStart={(e) => e.preventDefault()}
						className={`character`}
					/>
				</div>
				<div className="right-side">
					<div className="logo" />
					<div className="content">{Component({ ...PassedProps })}</div>
				</div>
			</div>
		</div>
	);
};

export default Authentication;
