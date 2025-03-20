import { isValidObjectId } from "mongoose";
import { z } from "zod";

const getAllLeadSourceSchema = z.object({
    orgId: z
        .string({ message: "OrganizationId is required." })
        .refine((str) => {
            return isValidObjectId(str);
        }),
});

export { getAllLeadSourceSchema };
