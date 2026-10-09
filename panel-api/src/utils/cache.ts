import memjs from 'memjs';
import { logError } from './helpers';
import { green, red, yellow } from 'colorette';

// The connection that will be used in here.
let memcached: ExpectedAny = null;
const prefix = `panel/`; // Just in case we ever want to expand into using the same server memcache for more apps.

export const setupMemcache = async () => {
	try {
		// Prepare the server details
		const server = {
			host: process.env.MEMCACHE_SERVER,
			username: process.env.MEMCACHE_USERNAME,
			password: process.env.MEMCACHE_PASSWORD
		};

		// @Reminder for later: You can add the port after host if needed. Ex: localhost:3400
		const connectionString = server.username ? `${server.username}:${server.password}@${server.host}` : `${server.host}`;

		// Make the connection..
		memcached = memjs.Client.create(connectionString, {
			timeout: 5000,
			retries: 1,
			expires: 500
		});

		// Test the connection by setting and retrieving a key
		const testKey = 'testLoading';
		const testValue = 'success';
		await memcached.set(testKey, testValue);
		const result = await memcached.get(testKey);

		if (result && result.value.toString() === testValue) {
			console.log(`${yellow('[MEMCACHE]')} Connection has been established successfully.`);
		}
	} catch (err) {
		await logError(`SETUP_MEMCACHE`, err);
	}
};

// @TBD Later: Aparent cand ai username sau pass gresit, eroarea este afiasta , dar acel err.message
export const getCache = async (id: string) => {
	try {
		// Get it from the cache..
		const response = await new Promise((resolve) => {
			// If we just started the nodejs server and memcache is not defined
			if (!memcached) return resolve(null);

			memcached.get(`${prefix}${id}`, async (err: ExpectedAny, data: ExpectedAny) => {
				if (process.env.MEMCACHE_DISABLED === 'true') return resolve(null);

				if (err) {
					await logError(`MEMCACHE_GET`, err, { id });
					return resolve(null);
				}

				if (!data) return resolve(null);

				return resolve(JSON.parse(data));
			});
		});

		return response;
	} catch (err) {
		await logError(`memcache:getCache`, err, { id });
		return null;
	}
};

/**
 *
 * @param id An unique id.
 * @param data An object.
 * @param expiresIn  Seconds
 * @returns
 */

export const setCache = async (id: string, data: ExpectedAny, expiresIn?: number) => {
	try {
		await new Promise((resolve) => {
			memcached.set(`${prefix}${id}`, JSON.stringify(data), expiresIn || 300, async (err: ExpectedAny, res: ExpectedAny) => {
				if (err) {
					await logError(`MEMCACHE_SET`, err, { id });
					return resolve(null);
				}

				resolve(res);
			});
		});
	} catch (err) {
		await logError(`memcache:setData`, err, { id });
	}
};

export const deleteCache = async (id: string) => {
	try {
		await new Promise((resolve) => {
			memcached.del(`${prefix}${id}`, async (err: ExpectedAny, res: ExpectedAny) => {
				if (err) {
					await logError(`MEMCACHE_DELETE`, err, { id });
					return resolve(null);
				}
				resolve(res);
			});
		});
	} catch (err) {
		await logError(`memcache:deleteCache`, err, { id });
	}
};
