// @Router path: /authentication

import { checkRouteIsAuthenticated } from '@/utils/helpers';
import Component from '@views/pages/authentication';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = checkRouteIsAuthenticated;

export default Component;
