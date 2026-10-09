import ReactDOM from 'react-dom';
import { isDevServer } from './utils/helpers';

// Dependencies
import NoAccess from './utils/theme/components/no_access';
import Application from './app';

const RenderedApp = () => (window.mp.fake && !isDevServer() ? <NoAccess /> : <Application />);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
