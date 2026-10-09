import * as yup from 'yup';

export const requsetResetSchema = yup.object().shape({
	credential: yup.string().trim().required()
});

export const confirmResetSchema = yup.object().shape({
	newPassword: yup.string().trim().required()
});
