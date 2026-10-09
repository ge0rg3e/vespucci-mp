import emojis from '@/definitions/emojis';
import { useState } from 'react';

interface Props {
	onSelectEmoji: (emoji: string) => void;
	active: boolean;
}

const categories = ['people', 'objects', 'nature', 'food'] as const;

const Component = (props: Props) => {
	const [category, setCategory] = useState<'people' | 'objects' | 'nature' | 'food'>('people');

	if (!props.active) return <></>;

	return (
		<div className="emojiPicker">
			<div className="entries">
				{emojis[category].map((emoji, i) => (
					<div className="entry" key={i} onClick={() => props.onSelectEmoji(emoji)}>
						{emoji}
					</div>
				))}
			</div>

			<div className="categories">
				{categories.map((entry) => (
					<div className="category" key={entry} onClick={() => setCategory(entry)}>
						<img src={`/assets/images/phone/apps/messages/emojiPicker/${entry}.png`} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Component;
