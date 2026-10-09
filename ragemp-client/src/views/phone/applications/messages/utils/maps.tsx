import Conversation from '../views/converastion';
import List from '../views/list';
import Compose from '../views/compose';

const mappedScreens: ExpectedAny = {
	list: (props: ExpectedAny) => <List {...props} />,
	conversation: (props: ExpectedAny) => <Conversation {...props} />,
	compose: (props: ExpectedAny) => <Compose {...props} />
};

export default mappedScreens;
