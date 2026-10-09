// @Router path: /

import { checkRouteIsNotAuthenticated } from '@/utils/helpers';
import Component from '@/views/pages/settings';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = checkRouteIsNotAuthenticated;

export default Component;
