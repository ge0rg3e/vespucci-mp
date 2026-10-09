import * as yup from 'yup';

export const loginSchema = yup.object().shape({
	username: yup.string().trim().required(),
	password: yup.string().trim().required(),
	rememberMe: yup.boolean().required()
});
