import Numbers from '../views/numbers';
import Sounds from '../views/sounds';
import Menu from '../views/menu';

const mappedScreens: ExpectedAny = {
	menu: (props: ExpectedAny) => <Menu {...props} />,
	sounds: (props: ExpectedAny) => <Sounds {...props} />,
	numbers: (props: ExpectedAny) => <Numbers {...props} />
};

export default mappedScreens;
