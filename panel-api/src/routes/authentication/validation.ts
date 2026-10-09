import yup from 'yup';

export const loginSchema = yup.object().shape({
	username: yup.string().required(),
	password: yup.string().required(),
	rememberMe: yup.boolean().required()
});

export const requsetResetPasstSchema = yup.object().shape({
	credential: yup.string().trim().required()
});

export const validateResetPassTokenSchema = yup.object().shape({
	token: yup.string().required()
});

export const confirmResetPassSchema = yup.object().shape({
	newPassword: yup.string().trim().required(),
	token: yup.string().required()
});
