//user joi validation schema

import Joi from "joi";
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
};

export const schemas = {
  userSchema: {
    create: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      fullName: Joi.string().min(6).required(),
      phoneNumber: Joi.number().required(),
    }),
    update: Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(6),
      fullName: Joi.string().min(6),
      phoneNumber: Joi.number().min(10).max(12),
    }),
  },
  messageSchema: {
    create: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
    }),
  },
};

export const idSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "The user ID is required.",
      "string.pattern.base": "The user ID must be a valid MongoDB ObjectId.",
    }),
});
