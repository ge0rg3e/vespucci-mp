import { MapComponent } from '@/utils/helpers';
import { Languages } from '@vmp/i18n';

// Natives
import LockScreen from '@phone/applications/lockscreen';
import HomeScreen from '@phone/applications/home';
import NotFound from '@phone/applications/notFound';
import Settings from '@phone/applications/settings';
import Phone from '@/views/phone/applications/phone';
import Messages from '@/views/phone/applications/messages';

// Additioanls
import House from '@phone/applications/house';
import HouseRent from '@/views/phone/applications/houseRent';
import Vehicles from '@/views/phone/applications/vehicles';
import TesterToolkit from '@/views/phone/applications/testerToolkit';
import Vespify from '@/views/phone/applications/vespify';
import VespifyMusic from '@/views/phone/applications/vespifyMusic';

const Mapping: { [key: string]: AppEntry } = {
	// Natives
	notFound: { theme: 'light', component: MapComponent(NotFound) },
	lockscreen: { theme: 'light', component: MapComponent(LockScreen) },
	home: { theme: 'light', component: MapComponent(HomeScreen) },
	phone: { theme: 'dark', component: MapComponent(Phone) },
	messages: { theme: 'dark', component: MapComponent(Messages) },
	// Apps
	house: {
		label: {
			EN: 'House',
			RO: 'Casă'
		},
		theme: 'light',
		icon: `house.png`,
		component: MapComponent(House)
	},
	houseRent: {
		label: {
			EN: 'Rent',
			RO: 'Chirie'
		},
		theme: 'light',
		icon: `rent.png`,
		component: MapComponent(HouseRent)
	},
	vehicles: {
		label: {
			EN: 'Vehicles',
			RO: 'Vehicule'
		},
		theme: 'dark',
		icon: `vehicles.png`,
		component: MapComponent(Vehicles)
	},
	testerToolkit: {
		label: {
			EN: 'Beta Testing',
			RO: 'Beta Testing'
		},
		icon: `betaTesting.png`,
		component: MapComponent(TesterToolkit),
		theme: 'light'
	},
	settings: {
		label: {
			EN: 'Settings',
			RO: 'Setari'
		},
		theme: 'dark',
		icon: `settings.png`,
		component: MapComponent(Settings)
	},
	vespify: {
		label: {
			EN: 'Vespify',
			RO: 'Vespify'
		},
		theme: 'light',
		icon: `vespify.png`,
		component: MapComponent(Vespify)
	},
	vespifyMusic: {
		label: {
			EN: 'Vespify Music',
			RO: 'Vespify Music'
		},
		theme: 'dark',
		icon: `vespifyMusic.png`,
		component: MapComponent(VespifyMusic)
	}
};

type AppEntry = {
	component: FixableAny;
	theme: 'dark' | 'light' | 'system';
	label?: Languages;
	icon?: string;
};

export default Mapping;
