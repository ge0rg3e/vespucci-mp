import { MessagesAttributes } from '@modules/database/game/messages/model/types';
import { CreateMessageInput } from '@modules/database/game/messages/repository/types';

declare global {
	interface PhoneMessage extends Omit<MessagesAttributes, 'content' | 'type' | 'recipients' | 'sender'> {
		id: number;

		// Contenvscode-file://vscode-app/d:/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.htmlt of message
		content: CreateMessageInput['content'];

		// This is the defintion of sender
		sender: CreateMessageInput['sender'];

		// This is the defintion of recipeints
		recipients: CreateMessageInput['recipients'];
	}
}
export {};
