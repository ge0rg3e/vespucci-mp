import { AppContext } from '@/utils/context';
import ReactDOMServer from 'react-dom/server';

// Components
import Username from '@components/username';

export const formatActionMessage = (action: ExpectedAny) => {
	const { language } = AppContext();

	const message = action.messages[language];
	const text = `<p>${message}</p>`;
	const pattern = new RegExp(`\\b${action.account.username}\\b`, 'g');
	const html = ReactDOMServer.renderToString(<Username className="player" account={action.account} useHref={true} redirect={true} />);

	const replacement = `${html}`;

	const newText = text.replace(pattern, replacement);

	return newText;
};
