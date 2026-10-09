// @Router path: /reset-password

import { makeEndpointRequest } from '@/utils/helpers';
import Component from '@views/pages/reset-password';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	if (!ctx.query.token) return { props: {} };

	try {
		await makeEndpointRequest(`auth/reset-password/${ctx.query.token}`, 'GET');

		return {
			props: {}
		};
	} catch (err: FixableAny) {
		return {
			redirect: {
				destination: '/reset-password?invalid=true',
				permanent: false
			}
		};
	}
};
export default Component;
