import Joi from 'joi';

export const signupSchema = Joi.object({
  first_name: Joi.string().min(2).max(60).trim().required(),
  last_name: Joi.string().min(2).max(60).trim().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(6)
    .max(60)
    .required(),
  password: Joi.string()
    .min(6)
    // Uncomment for stronger password
    // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
    .required(),
  phone_number: Joi.string()
    .required(),
  country: Joi.string().trim().required(),
  agreement: Joi.boolean().default(true)
});


export const signinSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(6)
    .max(60)
    .required(),
  password: Joi.string()
    .min(6)
    // Uncomment for stronger password
    // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
    .required(),
});
