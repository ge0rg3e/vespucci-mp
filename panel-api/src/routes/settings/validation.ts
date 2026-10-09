import yup from 'yup';

export const changePasswordSchema = yup.object().shape({
	password: yup.string().min(6).max(100).required(),
	newPassword: yup.string().min(6).max(100).required()
});

export const requestChangeEmailSchema = yup.object().shape({
	newEmail: yup.string().email().required()
});

export const changeEmailSchema = yup.object().shape({
	codeNewEmail: yup.string().trim().required(),
	codeOldEmail: yup.string().trim().required(),
	newEmail: yup.string().email().required()
});
