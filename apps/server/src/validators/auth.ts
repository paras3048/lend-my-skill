import * as joi from 'joi';

export const UserSignupParams = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  username: joi.string().alphanum().required(),
  name: joi.string().required(),
});

export const UserLoginParams = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
