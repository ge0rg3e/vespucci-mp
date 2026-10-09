import { formatNumber } from '@/utils/helpers';
import Donut from './donut';
import React from 'react';

function calculatePercentage(currentAmount: number, targetAmount: number) {
	return ((currentAmount / targetAmount) * 100).toFixed(0);
}

const Component = (props: ExpectedAny) => (
	<React.Fragment>
		<div className="entry">
			<div className="content">
				<Donut level={props.data.level}>
					<img className="icon" src={`/assets/images/pages/profiles/jobs/${props.data.label.toLowerCase().replace(/\s/g, '_')}.png`} alt="Job icon" />
				</Donut>
				<div className="details">
					<div className="name">{props.data.label}</div>

					<div className="information">
						<div className="line">
							<div className="label">Level</div>
							<div className="value">{props.data.level}</div>
						</div>
						<div className="line">
							<div className="label">Progress</div>
							<div className="value">
								{formatNumber(props.data.currentAmount)}/{formatNumber(props.data.targetAmount)} ({calculatePercentage(props.data.currentAmount, props.data.targetAmount)}%)
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</React.Fragment>
);

export default Component;
