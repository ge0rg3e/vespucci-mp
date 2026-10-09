import React from 'react';

interface SubHeaderProps {
	mt?: boolean;
	label?: string;
}

const SubHeader = ({ mt, label }: SubHeaderProps) => (
	<React.Fragment>
		<div className={`menu-subheader ${mt && `mt`}`}>
			<div className="label">{label}</div>
		</div>
	</React.Fragment>
);

export default SubHeader;
