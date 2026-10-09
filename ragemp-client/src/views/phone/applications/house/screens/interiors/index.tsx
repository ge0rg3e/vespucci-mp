import { AppState } from '../..';

// Components

import NavigationHeader from '@phone/components/ui/navigationHeader';
import Flex from '@phone/components/ui/flex';
import Icon from '@phone/components/ui/icon';

const Component = () => {
	const { lang, setScreen } = AppState();

	return (
		<div className="screen interiors">
			<NavigationHeader
				theme="light"
				title={lang.get('Interiors:Title')}
				goBack={() => setScreen('menu')}
			/>
			<div className="component-container">
				<div className={`app-component-card information-card`}>
					<Flex flexDirection="row" alignItems="center" style={{ marginBottom: 8 }}>
						<Icon color="#333" theme="light" icon="fa-solid fa-circle-info" size="sm" />
						<div className="heading">{lang.get('Interiors:Heading')}</div>
					</Flex>
					<div className="message">
						<p>{lang.get('Interiors:Message1')} </p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Component;
