import { conditionalClassNames } from '@/utils/helpers';
import React from 'react';
import { ComponentState } from '../..';

const Component = () => {
	const { refs, data, page, setPage, isDarkEnvironment } = ComponentState();

	const reorderPage = () => {
		window.rpc.triggerServer(
			`reorderInventoryPage`,
			JSON.stringify({ page, remoteId: refs.current.data.remoteId })
		);
	};

	return (
		<React.Fragment>
			<div
				id="storage-wrapper"
				className={conditionalClassNames(`inventory-tabs`, [
					{
						class: `night`,
						if: isDarkEnvironment
					}
				])}
			>
				{data.remotePages.map((tab: FixableAny, ix: number) => (
					<div
						id="inventory-tab"
						data-page={ix}
						onClick={() => setPage(ix)}
						className={`entry ${page === ix && `selected`} ${
							isDarkEnvironment && 'night'
						}`}
						key={ix}
					>
						<div className="badge">
							{tab.available ? (
								<div className="label">{ix + 1} </div>
							) : (
								<div className="icon">
									<i className="elm fa-light fa-lock"></i>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
			<div onClick={reorderPage} className="reorder-button">
				<div className="icon">
					<i className="elm fa-solid fa-repeat"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
