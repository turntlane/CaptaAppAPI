import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// User validation schemas
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

const coreUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.number().int().min(1, "Age must be a positive integer"),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
  friendsCount: z.number().int().min(0).optional(),
});

const registerSchema = coreUserSchema.extend({
  password: passwordSchema,
});

const createUserSchema = registerSchema.extend({
  isActive: z.boolean().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

const updateUserSchema = createUserSchema.partial();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const refreshSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "refreshToken is required")
    .max(512, "refreshToken is too long"),
});

// Validation middleware
const validateUser = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({
          error: "Validation failed",
          message: error.message || "Invalid input",
        });
      }
    }
  };
};

const validateCreateUser = validateUser(createUserSchema);
const validateUpdateUser = validateUser(updateUserSchema);
const validateRegister = validateUser(registerSchema);
const validateLogin = validateUser(loginSchema);
const validateRefresh = validateUser(refreshSchema);

export {
  validateCreateUser,
  validateUpdateUser,
  validateRegister,
  validateLogin,
  validateRefresh,
};
