import { green, red } from 'colorette';
import sendGrid from '@sendgrid/mail';
import express from 'express';
import 'dotenv/config';

// Dependencies
import { connect as connectDb } from '@utils/database';
import applyApplicationMiddlewares from './natives/applicationMiddlewares';
import setupRoutes from '@routes/mapping';
import './tasks';
import { setupMemcache } from './utils/cache';

// Setting up the express instance
const app = express();

// Apply the application middlewares..
applyApplicationMiddlewares(express, app);

// Set up the routes for this application
setupRoutes(app);

// Starting the application on the specific port

if (process.env.PORT === undefined) {
	console.error(`${red('[ERROR]')} Environment variable "PORT" is undefined.`);
	process.exit(1);
}

app.listen(process.env.PORT, async () => {
	// Connect the database..
	await connectDb();

	// Set up cache server..
	await setupMemcache();

	// Set the SendGrid API Key for sending emails..
	await sendGrid.setApiKey(process.env.SENDGRID_API_KEY!);

	// Inform that now is running..
	console.info(`${green('[DONE]')} API is now running on 127.0.0.1:${process.env.PORT}`);
});
