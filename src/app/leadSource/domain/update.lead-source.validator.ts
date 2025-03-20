import { isValidObjectId } from "mongoose";
import { z } from "zod";

const updateLeadSourceSchema = z.object({
    leadSourceId: z
        .string({ message: "LeadSourceId is required." })
        .refine((str) => {
            return isValidObjectId(str);
        }),
    name: z
        .string({ message: "Name is required." })
        .trim()
        .min(3, { message: "Name must be at least 3 characters" }),
    organizationId: z.
        string({ message: "OrganizationId is required." })
        .refine((str) => {
            return isValidObjectId(str);
        }),
});

export { updateLeadSourceSchema };
