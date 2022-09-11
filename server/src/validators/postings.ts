import * as joi from 'joi';

export const FetchPosting = joi.object({
  title: joi.string().required(),
  username: joi.string().required(),
});

export const CreatePosting = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  offers: joi
    .array()
    .items(
      joi
        .object({
          deliveryTime: joi.number().required(),
          name: joi.string().required(),
          price: joi.number().required().max(500000),
          description: joi.string().required(),
        })
        .required(),
    )
    .min(2)
    .max(3)
    .required(),
  heroImage: joi.string().required(),
  images: joi.array().items(joi.string().required()),
  categories: joi
    .array()
    .items(joi.string().required())
    .required()
    .min(1)
    .max(10),
});
