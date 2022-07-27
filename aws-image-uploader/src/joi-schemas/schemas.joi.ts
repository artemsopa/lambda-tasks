import Joi from 'joi';

export const signInSchema = Joi.object({
  userName: Joi.string()
    .min(6)
    .max(30)
    .lowercase()
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required(),
});

export const signUpSchema = Joi.object({
  userName: Joi.string()
    .min(4)
    .max(30)
    .lowercase()
    .required(),
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .min(6)
    .max(30)
    .lowercase()
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required(),
  confirm: Joi.ref('password'),
});

export const contextSchema = Joi.object().keys({
  authorizer: Joi.object().keys({
    claims: Joi.object().keys({
      email: Joi.string().required(),
    }).unknown(true),
  }).unknown(true),
}).unknown(true);

export const deleteImageSchema = Joi.object({
  title: Joi.string()
    .required(),
});
