//user joi validation schema

import Joi from "joi";
import { Request, Response, NextFunction } from "express";
export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
      email: Joi.string().email().when("$email", {
        is: Joi.exist(),
        then: Joi.string().email().min(1).required(),
        otherwise: Joi.string().email(),
      }),
      password: Joi.string().when("$password", {
        is: Joi.exist(),
        then: Joi.string().min(6).required(),
        otherwise: Joi.string().min(6),
      }),

      fullName: Joi.string().min(6),
      phoneNumber: Joi.number(),
    }),
    login: Joi.object({
      email: Joi.string()
        .email()
        .required()
        .error(new Error("Email is required")),
      password: Joi.string()
        .min(6)
        .required()
        .error(new Error("Password must be at least 6 characters long")),
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
  blogSchema: {
    create: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
    }),
    update: Joi.object({
      title: Joi.string().when("$title", {
        is: Joi.exist(),
        then: Joi.string().min(1).required(),
      }),
      content: Joi.string().when("$content", {
        is: Joi.exist(),
        then: Joi.string().min(1).required(),
      }),
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
