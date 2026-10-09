import { useEffect, useRef, useState } from 'react';
import { key } from '@/definitions/keys';
import { useTypeWriter } from '@/hooks/typeWriter';
import { useStateRef } from '@/utils/helpers';

const Component = ({ id, heading, contents }: ExpectedAny) => {
	const [index, setIndex, indexRef] = useStateRef(0);
	const typewriter = useRef<ExpectedAny>(null);

	const onKeyInteraction = () => {
		// If the typewriter is currently writing.
		if (typewriter.current && typewriter.current.isWritingRef.current) {
			// Stop writing and show the full text first.
			typewriter.current!.finishWriting();
			return false;
		}

		// Calculate the new index..
		const newIndex = indexRef.current + 1;

		// If there is no other monologue to pass through.
		if (newIndex === contents.length) {
			window.rpc.triggerServer('onConversationFinish', JSON.stringify({ id }));
			return false;
		}

		// Trigger the server
		window.rpc.triggerServer('onConversationProgress', JSON.stringify({ id, line: newIndex }));

		// Set the new index
		setIndex(newIndex);
	};

	/**
	 * When they tap Space to continue the story.
	 * @returns
	 */

	const onSpaceKey = (e: ExpectedAny) => {
		if (!key(e, 'Space')) return;

		// Progress on with the converastion
		onKeyInteraction();
	};

	const contentRendered = useTypeWriter({
		innerRef: typewriter,
		text: contents[index],
		soundEffect: `${__ASSETS__}/audios/systems/conversation/typing_v3.mp3`
	});

	useEffect(() => {
		document.addEventListener('keyup', onSpaceKey);
		return () => document.removeEventListener('keyup', onSpaceKey);
	}, []);

	return (
		<div className="monologue" onClick={onKeyInteraction}>
			<div className="heading">
				<div className="heading-content">{heading}</div>
			</div>
			<div className="content">{contentRendered}</div>
		</div>
	);
};

export default Component;
