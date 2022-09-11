import * as joi from 'joi';

export const UpdateBIO = joi.object({
  bio: joi.string().required(),
});
