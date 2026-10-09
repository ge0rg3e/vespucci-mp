import yup from 'yup';

export const profileSchema = yup.object().shape({
	username: yup.string().required()
});
