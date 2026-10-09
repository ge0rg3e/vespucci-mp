import { getLanguagePack } from '@vmp/i18n';
import React from 'react';

// Context
import { AppState } from '../../..';
import { ViewState } from '..';

const Component = () => {
	const { deleting, setDeleting, deletingParticipants, setDeletingParticipants } = ViewState();
	const lang = getLanguagePack('PHONE_APP_MESSAGES_LIST', window.language);
	const { deleteConversation, setSubRoute } = AppState();

	const switchDeleting = () => {
		setDeleting(!deleting);

		// Reset..
		setDeletingParticipants([]);
	};

	const onCompose = () => {
		setSubRoute('compose');
	};

	const confirmDeletion = () => {
		window.phone.showAlert({
			title: lang.get('Header.confirmDeletion.title'),
			description: lang.get('Header.confirmDeletion.description'),
			buttons: [
				{
					text: lang.get('yes'),
					color: 'red',
					onSelection: ({ dismiss }) => {
						// Unset
						setDeleting(false);

						// Dismiss alert
						dismiss();

						// Delete these converastions
						deletingParticipants.forEach((x: ExpectedAny) => {
							deleteConversation(x);
						});
					}
				},
				{
					text: lang.get('no'),
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});
	};

	return (
		<React.Fragment>
			<div className="component-app-header">
				<div className="left-side">
					<div className="entry" onClick={switchDeleting}>
						<div className="label">
							{deleting ? lang.get('cancel') : lang.get('edit')}
						</div>
					</div>
				</div>
				<div className="right-side">
					{deleting ? (
						<React.Fragment>
							<div
								className={`entry ${deletingParticipants.length < 1 && 'disabled'}`}
								onClick={confirmDeletion}
							>
								<div className="label">{lang.get('delete')}</div>
							</div>
						</React.Fragment>
					) : (
						<React.Fragment>
							<div className="entry add" onClick={onCompose}>
								<div className="icon">
									<i className="elm fa-solid fa-pen-to-square"></i>
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
