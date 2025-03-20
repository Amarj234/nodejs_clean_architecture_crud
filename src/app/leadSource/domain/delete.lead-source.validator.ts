import { isValidObjectId } from "mongoose";
import { z } from "zod";

const deleteLeadSourceSchema = z.object({
    leadSourceId: z.
        string({ message: "LeadSourceId is required." })
        .refine((str) => {
            return isValidObjectId(str);
        }),
});

export { deleteLeadSourceSchema };
