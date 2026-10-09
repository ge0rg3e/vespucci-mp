import { findPlayerAt, findPlayerAtAccountId, isEmoji } from '@server/utils/helpers';

export type argumentTypes = 'player' | 'number' | 'float' | 'string' | 'fullText' | `vehicle`;

mp.commands.addArgumentType({
	name: 'string',
	handler: ({ value, argument, lang }) => {
		if (typeof value !== 'string') throw new Error(lang.get('PARSER_TYPE_STRING_ERR', { val: value, arg: argument }));
		if (isEmoji(value)) throw new Error(lang.get('PARSER_TYPE_STRING_ERR', { val: value, arg: argument }));
		return value;
	}
});

mp.commands.addArgumentType({
	name: 'fullText',
	handler: ({ value, inputsEntered, argument, lang }) => {
		if (typeof value !== 'string') throw new Error(lang.get('PARSER_TYPE_STRING_ERR', { val: value, arg: argument }));
		const clonedInputs = [...inputsEntered];
		const clonedArray = clonedInputs.slice(clonedInputs.indexOf(value));
		return clonedArray.join(' ');
	}
});

mp.commands.addArgumentType({
	name: 'number',
	handler: ({ value, argument, lang }) => {
		const parsedValue = parseInt(value);
		if (isNaN(parsedValue) || parsedValue < 0) throw new Error(lang.get('PARSER_TYPE_NUMBER_ERR', { val: value, arg: argument }));
		return parsedValue;
	}
});

mp.commands.addArgumentType({
	name: 'float',
	handler: ({ value, argument, lang }) => {
		const parsedValue = parseFloat(value);
		if (isNaN(parsedValue)) throw new Error(lang.get('PARSER_TYPE_FLOAT_ERR', { val: value, arg: argument }));
		return parsedValue;
	}
});

mp.commands.addArgumentType({
	name: 'player',
	handler: ({ value, argument, lang }) => {
		const foundEntity = findPlayerAtAccountId(value);
		if (foundEntity === null) throw new Error(lang.get('PARSER_TYPE_PLAYER_ERR', { val: value, arg: argument }));
		return foundEntity;
	}
});

//** Example of the handler first parameter object **/
// //hello [name] [text]
// player writes: /helo da 23 12 1 1
// {
// 	value: 'da',
// 	inputsEntered: [ 'da', '23', '12', '1', '1' ],
// 	player: playerMp Object,
// 	type: 'string',
// 	argument: 'name'
// }
// **
