import Image from 'next/image';
import React from 'react';

const Component = (props: ComponentProps) => (
	<React.Fragment>
		<Image
			onLoad={(e: ExpectedAny) => (e.target.className += ' loaded')}
			onContextMenu={(e) => e.preventDefault()}
			className={props.className || ''}
			height={props.height}
			width={props.width}
			draggable={false}
			src={props.src}
			alt={props.alt}
		/>
	</React.Fragment>
);

type ComponentProps = {
	className?: string;
	height: string;
	width: string;
	src: string;
	alt: string;
};

export default Component;
