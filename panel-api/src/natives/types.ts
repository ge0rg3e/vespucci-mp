import { Request, Response, NextFunction } from 'express';

declare global {
	// eslint-disable-next-line
	interface ApiResponse extends Response {}

	// eslint-disable-next-line
	interface ApiRequest extends Request {}

	// eslint-disable-next-line
	interface ApiNext extends NextFunction {}
}

export {};
