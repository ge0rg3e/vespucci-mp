import React from 'react';

interface Props {
	goBack?: FixableAny;
	backLabel?: string;
	left?: FixableAny;
	middle?: FixableAny;
	title?: FixableAny;
	right?: FixableAny;
	theme?: 'light' | 'dark' | 'system';
}

const Component = (props: Props) => {
	const componentTheme =
		props.theme === 'system' || !props.theme ? window.phone.theme : props.theme;

	const langBack = window.language === 'RO' ? 'Inapoi' : 'Back';

	return (
		<React.Fragment>
			<div className={`app-navigation-header ${componentTheme}`}>
				<div className="left">
					{props.goBack && (
						<div className="icon" onClick={props.goBack}>
							<i className="elm fa-solid fa-chevron-left"></i>
							<div className="label">
								{props.backLabel ? props.backLabel : langBack}
							</div>
						</div>
					)}
					{props.left}
				</div>
				<div className="middle">
					{props.middle}
					{props.title && <div className="title">{props.title}</div>}
				</div>
				<div className="right">{props.right}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
