import joi from "joi";

export const inputProductValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().required(),
    qty: joi.number().required(),
    price: joi.number().required(),
    category: joi.string().trim().optional().allow(null, ''),
  });
  return schema.validate(payload);
};
