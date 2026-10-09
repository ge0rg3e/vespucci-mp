import { percentage } from '@/utils/helpers';
import React from 'react';

const Component = ({ current, total }: ExpectedAny) => (
	<React.Fragment>
		<div className="seconds-left">
			<div
				className="progress"
				id={`${percentage(current, total)}%`}
				style={{
					width: `${percentage(current, total)}%`
				}}
			/>
		</div>
	</React.Fragment>
);

export default Component;
