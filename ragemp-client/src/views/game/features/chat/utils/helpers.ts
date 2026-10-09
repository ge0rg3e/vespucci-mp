const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const tagOrComment = new RegExp(
	'<(?:' +
		// Comment body.
		'!--(?:(?:-*[^->])*--+|-?)' +
		// Special "raw text" elements whose content should be elided.
		'|script\\b' +
		tagBody +
		'>[\\s\\S]*?</script\\s*' +
		'|style\\b' +
		tagBody +
		'>[\\s\\S]*?</style\\s*' +
		// Regular name
		'|/?[a-z]' +
		tagBody +
		')>',
	'gi'
);

export function colorify(text: string) {
	if (!text) return text;
	if (text.length <= 0) return text;

	const matches = [];
	let m = null;
	let curPos = 0;
	do {
		m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));
		if (!m) break;
		matches.push({
			found: m[0],
			index: m['index'] + curPos
		});
		curPos = curPos + m['index'] + m[0].length;
	} while (m != null);
	if (matches.length > 0) {
		text += '</font>';
		for (let i = matches.length - 1; i >= 0; --i) {
			const color = matches[i].found.substring(1, matches[i].found.length - 1);
			const insertHtml = (i !== 0 ? '</font>' : '') + '<font color="#' + color + '">';
			text =
				text.slice(0, matches[i].index) +
				insertHtml +
				text.slice(matches[i].index + matches[i].found.length, text.length);
		}
	}
	return text;
}

export function removeHtmlTags(html: ExpectedAny) {
	let oldHtml;
	do {
		oldHtml = html;
		html = html.replace(tagOrComment, '');
	} while (html !== oldHtml);

	return html.replace(/</g, '&lt;');
}

export const formatContentMessage = (text: string, params: ExpectedAny = {}) => {
	text = removeHtmlTags(text);
	text = colorify(text);

	if (params && params.includeBreakline) {
		text = text.replaceAll('{BR}', '<br />'); // extra for chat only.
	}
	return text;
};
