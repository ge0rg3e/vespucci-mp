// @Router path: /profiles/:username

import { logError, makeEndpointRequest } from '@/utils/helpers';
import Component from '@/views/pages/profiles';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const data = await makeEndpointRequest(`profiles/${ctx.query.username}`, 'GET');

		return {
			props: { data }
		};
	} catch (err: FixableAny) {
		if (err && err.response.status === 404) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			};
		}

		await logError(`LOAD_PROFILES`, err);
		return {
			redirect: {
				destination: `/having-difficulties?code=LOAD_PROFILE`,
				permanent: false
			}
		};
	}
};

export default Component;
