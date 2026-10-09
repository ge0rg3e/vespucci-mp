// This is just a small middleware written by George to help us return faster.

const sendResponse = (res: FixableAny, status: ServerStatusCodes, body: Payload) => {
	if (typeof body === 'string' && [400, 401, 403, 404, 500].includes(status)) {
		body = { error: body };
	} else if (typeof body === 'string') {
		body = { message: body };
	}

	return res.status(status).json(body);
};

const formatServerResponse = function (_: ExpectedAny, res: ApiResponse, next: ApiNext) {
	res.sendResponse = (status: ServerStatusCodes, body: Payload) => sendResponse(res, status, body);

	next();
};

export type Payload = string | object | boolean | Array<ExpectedAny>;

export type ServerStatusCodes =
	| 200 // Success
	| 201 // Created
	| 302 // Found
	| 400 // Bad Request
	| 401 // Unauthorised
	| 403 // Forbidden
	| 404 // Not Found
	| 500; // Internal error

// eslint-disable-next-line
declare global {
	interface ApiResponse {
		sendResponse: (status: ServerStatusCodes, body: string | object | Array<ExpectedAny>) => void;
	}
}

export default formatServerResponse;
