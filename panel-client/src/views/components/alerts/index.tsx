import React, { useEffect, useState } from 'react';
import Alert from '@/views/components/alerts/components/entry';

// Types
import { ComponentProps, DispatchParams, Type } from './types';
import { getAlerts } from '@/utils/helpers';

const Component = (props: ComponentProps) => {
	const [data, setData] = useState<ExpectedAny>(null);

	const listener = (e: FixableAny) => setData(e.detail);

	const dispatchAlert = (params: DispatchParams) => {
		document.dispatchEvent(
			new CustomEvent(`alertsDispatching:${params.listenerId}`, {
				detail: {
					message: params.message,
					type: params.type
				}
			})
		);

		if (params.seconds) {
			// Auto dismiss..
			setTimeout(() => setData(null), params.seconds * 1000);
		}
	};

	const removeAlerts = (id: string) => {
		document.dispatchEvent(
			new CustomEvent(`alertsDispatching:${id}`, {
				detail: null
			})
		);
	};

	const instanceCreation = (identifier: string) => ({
		set: (type: Type, message: string, seconds = 10) =>
			dispatchAlert({
				listenerId: identifier,
				type,
				message,
				seconds
			}),
		reset: () => removeAlerts(identifier)
	});

	useEffect(() => {
		// Add the functions
		window.alerts = instanceCreation;

		// Set up the events
		document.addEventListener(`alertsDispatching:${props.id}`, listener);

		// If the parent wants to be informed about mounting
		if (props.onMount) {
			props.onMount(getAlerts(props.id));
		}

		return () => {
			document.removeEventListener(`alertsDispatching:${props.id}`, listener);
		};
		// eslint-disable-next-line
	}, []);

	if (data === null) return <></>;

	return <Alert {...data} />;
};

export default Component;
