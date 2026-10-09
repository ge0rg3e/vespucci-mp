import { useEffect, useState } from 'react';
import Interactive from './components/interactive';
import Monologue from './components/monologue';
import SimulatedResponse from './response';

const Component = () => {
	const [response, setResponse] = useState<ExpectedAny | null>(null);

	const onDataReceived = (args: string) => {
		const data = JSON.parse(args);
		setResponse(data);
	};

	useEffect(() => {
		window.rpc.on('conversation.setData', onDataReceived);

		// Faking a response for simulation purposes.
		if (mp.fake) setResponse(SimulatedResponse);

		return () => window.rpc.off('conversation.setData', onDataReceived);
	}, []);

	if (response === null) return null;

	return (
		<div className="system-conversation">
			{response.type === 'monologue' ? <Monologue {...response} /> : <Interactive {...response} />}
		</div>
	);
};

export default Component;
