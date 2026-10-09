import { useEffect, useState } from 'react';
import { key } from '@/definitions/keys';

const Component = (props: ExpectedAny) => {
	const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

	const sendSubmit = (option: ExpectedAny) => {
		// Inform server-side
		window.rpc.triggerServer('onConversationInteraction', JSON.stringify({ id: props.id, option }));
	};

	const handleSubmit = (selectedOption?: any) => {
		if (selectedOption) return sendSubmit(selectedOption);

		setSelectedItemIndex((index) => {
			if (index === -1) return index;
			sendSubmit(props.options[index]);
			return index;
		});
	};

	const handleArrow = (increment: number) =>
		setSelectedItemIndex((prevIndex) => Math.min(Math.max(prevIndex + increment, 0), props.options.length - 1));

	const handleKeyUp = (e: ExpectedAny) => {
		switch (true) {
			case key(e, 'Enter'):
				handleSubmit();
				break;
			case key(e, 'ArrowUp'):
				handleArrow(-1);
				break;
			case key(e, 'ArrowDown'):
				handleArrow(1);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		window.addEventListener('keyup', handleKeyUp);
		return () => window.removeEventListener('keyup', handleKeyUp);
	}, []);

	return (
		<div className="interactive">
			<div className="box">
				<div className="heading">
					<div className="heading-content">{props.heading}</div>
				</div>
				<div className="content">{props.contents[0]}</div>
			</div>
			<div className="options">
				{props.options.map((entry: ExpectedAny, i: number) => (
					<div
						className={`option ${selectedItemIndex === i ? 'selected' : ''}`}
						onMouseEnter={() => setSelectedItemIndex(-1)}
						onClick={() => handleSubmit(entry)}
						key={i}
					>
						{entry.text}
					</div>
				))}
			</div>
		</div>
	);
};

export default Component;
