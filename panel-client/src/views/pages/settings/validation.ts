import * as yup from 'yup';

export const changePasswordSchema = yup.object().shape({
	currentPassword: yup.string().trim().required(),
	newPassword: yup.string().trim().required()
});

export const requestChangeEmailSchema = yup.object().shape({
	newEmail: yup.string().email().required()
});

export const changeEmailSchema = yup.object().shape({
	codeNewEmail: yup.string().trim().required(),
	codeOldEmail: yup.string().trim().required(),
	newEmail: yup.string().email().required()
});
