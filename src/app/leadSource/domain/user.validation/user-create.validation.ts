import { z } from "zod";

// Define the Zod schema for user validation
 const userSchemaValidate = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email format").trim(),
    age: z.number().int().min(0, "Age must be a positive number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user"]),
}).superRefine((data, ctx) => {
    if (data.role === "admin" && data.age < 30) {
        ctx.addIssue({
            path: ["age"],
            message: "Admins must be at least 30 years old.",
            code: "custom",
        });
    }
    if (data.role === "user" && data.age >= 20) {
        ctx.addIssue({
            path: ["age"],
            message: "Users must be younger than 20 years old.",
            code: "custom",
        });
    }
});



export { userSchemaValidate };