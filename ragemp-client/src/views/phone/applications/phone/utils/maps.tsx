//   Dial
import DialNumber from '../views/dialNumber';

// Views: Contacts
import ListContacts from '../views/listContacts';
import ContactDetails from '../views/contactDetails';
import EditContact from '../views/editContact';
import CreateContact from '../views/createContact';
import ContactCard from '../views/contactCard';

// Views: Recent Calls
import RecentCalls from '../views/recentCalls';

const mappedScreens: ExpectedAny = {
	// Dial
	dialNumber: (props: ExpectedAny) => <DialNumber {...props} />,
	// Recent calls
	recentCalls: (props: ExpectedAny) => <RecentCalls {...props} />,
	// Contacts
	listContacts: (props: ExpectedAny) => <ListContacts {...props} />,
	contactDetails: (props: ExpectedAny) => <ContactDetails {...props} />,
	editContact: (props: ExpectedAny) => <EditContact {...props} />,
	createContact: (props: ExpectedAny) => <CreateContact {...props} />,
	contactCard: (props: ExpectedAny) => <ContactCard {...props} />
};

export default mappedScreens;
