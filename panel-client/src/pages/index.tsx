// @Router path: /

import { logError, makeEndpointRequest } from '@/utils/helpers';
import Component from '@/views/pages/homepage';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const data = await makeEndpointRequest('homepage', 'GET');

		return {
			props: { ...data }
		};
	} catch (err: FixableAny) {
		await logError(`LOAD_HOMEPAGE`, err);
		return {
			redirect: {
				destination: `/having-difficulties?code=LOAD_HOMEPAGE`,
				permanent: false
			}
		};
	}
};

export default Component;
