import yup from 'yup';

export const reqIdSchema = yup.object().shape({
	id: yup.number().positive().required()
});

export const createAccountSchema = yup.object().shape({
	username: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required()
});

export const updateAccountSchema = yup.object().noUnknown(true).shape({
	email: yup.string().email(),
	password: yup.string()
});
