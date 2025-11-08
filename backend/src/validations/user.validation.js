import joi from "joi";
export const inputUserValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().required(),
    address: joi.string().trim().required(),
  });
  return schema.validate(payload);
};
