import { Request, Response } from "express";

export const validateRequest = (schema: any, req: Request, res: Response): boolean => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return false; // Validation failed
  }
  return true; // Validation passed
};