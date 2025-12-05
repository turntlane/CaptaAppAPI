"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefresh = exports.validateLogin = exports.validateRegister = exports.validateUpdateUser = exports.validateCreateUser = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter");
const coreUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    username: zod_1.z.string().min(3, "Username must be at least 3 characters"),
    firstName: zod_1.z.string().min(1, "First name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    age: zod_1.z.number().int().min(1, "Age must be a positive integer"),
    avatarUrl: zod_1.z.string().url("Invalid avatar URL").optional(),
    friendsCount: zod_1.z.number().int().min(0).optional(),
});
const registerSchema = coreUserSchema.extend({
    password: passwordSchema,
});
const createUserSchema = registerSchema.extend({
    isActive: zod_1.z.boolean().optional(),
    role: zod_1.z.enum(["USER", "ADMIN"]).optional(),
});
const updateUserSchema = createUserSchema.partial();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string()
        .min(1, "refreshToken is required")
        .max(512, "refreshToken is too long"),
});
const validateUser = (schema) => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    error: "Validation failed",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            else {
                res.status(400).json({
                    error: "Validation failed",
                    message: error.message || "Invalid input",
                });
            }
        }
    };
};
const validateCreateUser = validateUser(createUserSchema);
exports.validateCreateUser = validateCreateUser;
const validateUpdateUser = validateUser(updateUserSchema);
exports.validateUpdateUser = validateUpdateUser;
const validateRegister = validateUser(registerSchema);
exports.validateRegister = validateRegister;
const validateLogin = validateUser(loginSchema);
exports.validateLogin = validateLogin;
const validateRefresh = validateUser(refreshSchema);
exports.validateRefresh = validateRefresh;
//# sourceMappingURL=validation.js.map