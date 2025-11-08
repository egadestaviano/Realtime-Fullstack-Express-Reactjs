import joi from "joi";

export const inputProductValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().required(),
    qty: joi.number().required(),
    price: joi.number().required(),
  });
  return schema.validate(payload);
};
